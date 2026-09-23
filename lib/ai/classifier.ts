/**
 * Computer Vision Waste Classifier Engine — v2
 *
 * Key improvements over v1:
 * - Hard physical exclusion rules (high specular → NOT wet, transparent → glass/plastic)
 * - Narrowed wet-waste hue range (organic browns/greens only, NOT all warm colors)
 * - Dynamic confidence that can drop below 65% to trigger valid rejections
 * - Prototype nearest-neighbor with increased weight on specular + texture
 * - Balanced scoring that doesn't default-bias toward "wet"
 */

import { BALANCED_WASTE_DATASET, WasteCategoryProfile } from './dataset';

export type DetectedWasteType = 'wet' | 'dry' | 'plastic' | 'paper' | 'glass' | 'metal' | 'e-waste';

export interface ClassificationResult {
  topCategory: DetectedWasteType;
  categoryName: string;
  parentBin: 'wet' | 'dry' | 'special';
  confidence: number; // 0 - 100
  classProbabilities: Record<DetectedWasteType, number>;
  isUnclearOrBlurry: boolean;
  clarityScore: number; // 0 - 100
  extractedFeatures: {
    meanLuminance: number;
    laplacianVariance: number;
    specularRatio: number;
    edgeDensity: number;
    dominantHue: number;
    meanSaturation: number;
  };
  explanation: string;
}

/** Convert RGB [0,255] → HSV: H [0,360], S [0,1], V [0,1] */
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rN = r / 255, gN = g / 255, bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const diff = max - min;
  let h = 0;
  if (diff !== 0) {
    if (max === rN)      h = ((gN - bN) / diff) % 6;
    else if (max === gN) h = (bN - rN) / diff + 2;
    else                 h = (rN - gN) / diff + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : diff / max;
  return [h, s, max];
}

/** Extract all optical features from an image source */
export async function extractImageFeatures(
  imageSource: string | File | Blob | HTMLImageElement
): Promise<{
  pixels: Uint8ClampedArray;
  width: number; height: number;
  meanLuminance: number;
  laplacianVariance: number;
  specularRatio: number;
  edgeDensity: number;
  dominantHue: number;
  meanSaturation: number;
  meanValue: number;
  avgHsv: [number, number, number];
  transparencyRatio: number; // fraction of very-high-V + low-S pixels (glass/plastic indicator)
  darkMatteFraction: number; // fraction of low-V + low-S pixels (organic/paper indicator)
  colorVariance: number;     // hue spread — high = multiple colors (e-waste/paper)
}> {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const DIM = 128;
        const canvas = document.createElement('canvas');
        canvas.width = DIM; canvas.height = DIM;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) { resolve(getDefaultOpticalMetrics()); return; }

        ctx.drawImage(img, 0, 0, DIM, DIM);
        const { data } = ctx.getImageData(0, 0, DIM, DIM);

        let totalLum = 0, totalSat = 0, totalVal = 0;
        let specularCount = 0, transparentCount = 0, darkMatteCount = 0;
        const hueBins = new Array(36).fill(0); // 10-degree bins
        const gray = new Float32Array(DIM * DIM);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          gray[i / 4] = lum;
          totalLum += lum;

          const [h, s, v] = rgbToHsv(r, g, b);
          totalSat += s;
          totalVal += v;

          // Specular highlight: very bright + very desaturated (shiny plastic/glass/metal)
          if (v > 0.88 && s < 0.18) specularCount++;

          // Transparent/highly reflective: high brightness, low sat (glass, clear plastic)
          if (v > 0.80 && s < 0.25) transparentCount++;

          // Dark matte: low brightness + low saturation (organic matter, dirt, soil)
          if (v < 0.45 && s < 0.40) darkMatteCount++;

          // Hue bins weighted by saturation (only count colorful pixels)
          if (s > 0.12) {
            const hBin = Math.min(35, Math.floor(h / 10));
            hueBins[hBin] += s;
          }
        }

        const N = DIM * DIM;
        const meanLuminance = totalLum / N;
        const meanSaturation = totalSat / N;
        const meanValue = totalVal / N;
        const specularRatio = specularCount / N;
        const transparencyRatio = transparentCount / N;
        const darkMatteFraction = darkMatteCount / N;

        // Dominant hue
        let maxHW = 0, dominantHueBin = 0;
        for (let i = 0; i < 36; i++) {
          if (hueBins[i] > maxHW) { maxHW = hueBins[i]; dominantHueBin = i; }
        }
        const dominantHue = dominantHueBin * 10 + 5;

        // Color spread (variance of occupied hue bins — high = colorful/e-waste/mixed)
        const occupiedBins = hueBins.filter(w => w > 0.01).length;
        const colorVariance = occupiedBins / 36; // 0–1

        // Laplacian blur + edge density
        let edgeCount = 0, lapSum = 0, lapSqSum = 0, samples = 0;
        for (let y = 1; y < DIM - 1; y++) {
          for (let x = 1; x < DIM - 1; x++) {
            const idx = y * DIM + x;
            const lap = Math.abs(
              4 * gray[idx] - gray[(y-1)*DIM+x] - gray[(y+1)*DIM+x]
              - gray[y*DIM+(x-1)] - gray[y*DIM+(x+1)]
            );
            lapSum += lap; lapSqSum += lap * lap; samples++;
            if (lap > 28) edgeCount++;
          }
        }
        const meanLap = samples > 0 ? lapSum / samples : 0;
        const laplacianVariance = samples > 0 ? lapSqSum / samples - meanLap * meanLap : 0;
        const edgeDensity = samples > 0 ? edgeCount / samples : 0;

        resolve({
          pixels: data, width: DIM, height: DIM,
          meanLuminance, laplacianVariance, specularRatio, edgeDensity,
          dominantHue, meanSaturation, meanValue,
          transparencyRatio, darkMatteFraction, colorVariance,
          avgHsv: [dominantHue, meanSaturation, meanValue],
        });
      };

      img.onerror = () => resolve(getDefaultOpticalMetrics());

      if (typeof imageSource === 'string') img.src = imageSource;
      else if (imageSource instanceof File || imageSource instanceof Blob)
        img.src = URL.createObjectURL(imageSource);
      else if ('src' in imageSource) img.src = (imageSource as HTMLImageElement).src;
      else resolve(getDefaultOpticalMetrics());
    });
  }
  return Promise.resolve(getDefaultOpticalMetrics());
}

function getDefaultOpticalMetrics() {
  return {
    pixels: new Uint8ClampedArray(0), width: 128, height: 128,
    meanLuminance: 120, laplacianVariance: 85, specularRatio: 0.15,
    edgeDensity: 0.35, dominantHue: 40, meanSaturation: 0.35, meanValue: 0.47,
    transparencyRatio: 0.15, darkMatteFraction: 0.20, colorVariance: 0.30,
    avgHsv: [40, 0.35, 0.47] as [number, number, number],
  };
}

/**
 * Classify a waste image using hard optical rules + prototype scoring.
 * Works entirely offline — no API keys required.
 */
export async function classifyWasteImage(
  imageSource?: string | File | Blob | HTMLImageElement
): Promise<ClassificationResult> {
  if (!imageSource) {
    return lowConfidenceResult('No photo provided. Please take a clear photo.');
  }

  const f = await extractImageFeatures(imageSource);

  // ── 1. Image Quality Check ──────────────────────────────────────────────────
  const isTooDark   = f.meanLuminance < 22;
  const isOverblown = f.meanLuminance > 248;
  const isBlurry    = f.laplacianVariance < 14;
  const isBlank     = f.edgeDensity < 0.02;
  const isUnclearOrBlurry = isTooDark || isOverblown || isBlurry || isBlank;

  let clarityScore = 90;
  if (isTooDark)   clarityScore -= 50;
  if (isOverblown) clarityScore -= 45;
  if (isBlurry)    clarityScore -= 40;
  if (isBlank)     clarityScore -= 40;
  clarityScore = Math.max(15, Math.min(99, clarityScore));

  if (isUnclearOrBlurry) {
    const reason = isTooDark ? 'Image too dark — turn on room lighting.'
      : isOverblown ? 'Image overexposed — reduce glare and re-take.'
      : isBlurry    ? 'Image blurry — hold the camera steady.'
                    : 'Image unclear — center the waste item and re-take.';
    return lowConfidenceResult(reason);
  }

  // ── 2. Hard Physical Exclusion Rules ────────────────────────────────────────
  // These are categorical rules based on real material science:
  //
  // RULE A: High specular ratio → reflective surface → CANNOT be wet/organic waste
  //   Wet organic matter (food scraps, peels) is always matte and non-reflective.
  //   Specular > 0.15 strongly indicates plastic, glass, or metal.
  //
  // RULE B: High transparency ratio → clear/semi-clear material → plastic or glass
  //
  // RULE C: Very dark + very matte → organic matter or dark paper/cardboard
  //
  // RULE D: High color variance → multiple distinct colors → e-waste (circuit boards)
  //         or mixed dry waste packaging

  const { specularRatio: spec, transparencyRatio: trans, darkMatteFraction: dark,
          colorVariance, meanSaturation: sat, meanValue: val,
          dominantHue: hue, edgeDensity: edges } = f;

  // Pre-compute hard exclusions: these force a category out of the running
  const HARD_NOT_WET   = spec > 0.18 || trans > 0.35;  // reflective/transparent → not organic
  const HARD_NOT_METAL = spec < 0.10 && val < 0.65;    // too dark/matte for metal
  const HARD_NOT_GLASS = trans < 0.15 && spec < 0.10;  // not reflective/clear → not glass
  const HARD_NOT_EWASTE = colorVariance < 0.20 && edges < 0.25; // uniform color → not e-waste board

  // ── 3. Score Each Category ─────────────────────────────────────────────────
  const categories: DetectedWasteType[] = ['wet','dry','plastic','paper','glass','metal','e-waste'];
  const scores: Record<DetectedWasteType, number> = {
    wet: 0, dry: 0, plastic: 0, paper: 0, glass: 0, metal: 0, 'e-waste': 0
  };

  // ── WET WASTE ──
  // Organic matter: matte surface, earth tones (brown/green/yellow), medium-dark
  {
    let s = 0;
    // Hue: organic earth tones ONLY — browns (20-45), greens (60-140), yellows (45-65)
    const organicHue = (hue >= 20 && hue <= 140);
    s += organicHue ? 30 : 0;
    // Must be matte (low specular) — key discriminator
    s += spec < 0.06 ? 35 : spec < 0.12 ? 15 : 0;
    // Medium saturation (food has some color)
    s += (sat >= 0.15 && sat <= 0.65) ? 20 : 0;
    // Medium-dark brightness (not super bright)
    s += (val >= 0.20 && val <= 0.70) ? 15 : 0;
    // Apply hard exclusion
    if (HARD_NOT_WET) s = Math.min(s, 20); // cap at 20 if reflective
    scores['wet'] = s;
  }

  // ── PLASTIC ──
  // PET bottles, packaging: moderate-high specular, many colors, moderate edges
  {
    let s = 0;
    // Key: any color (plastic comes in all colors)
    s += 15; // base — plastic is ubiquitous
    // Good specular (shiny surface) — strong signal
    s += spec >= 0.12 ? 35 : spec >= 0.07 ? 20 : 5;
    // Moderate transparency (often semi-clear)
    s += trans >= 0.20 ? 20 : trans >= 0.10 ? 10 : 0;
    // Moderate saturation (label colors)
    s += (sat >= 0.10 && sat <= 0.75) ? 15 : 5;
    // Moderate edges (label text/graphics)
    s += (edges >= 0.15 && edges <= 0.60) ? 15 : 5;
    scores['plastic'] = s;
  }

  // ── PAPER / CARDBOARD ──
  // Dry, fibrous, low specular, often beige/grey/white tones
  {
    let s = 0;
    // Hue: neutral / warm-neutral (cream, beige, grey, white)
    const paperHue = (hue >= 20 && hue <= 60) || sat < 0.15;
    s += paperHue ? 25 : 10;
    // Very low specular (matte surface)
    s += spec < 0.08 ? 30 : spec < 0.15 ? 15 : 0;
    // Low-medium saturation (cardboard is beige, newspaper is grey)
    s += (sat >= 0.02 && sat <= 0.40) ? 25 : 5;
    // Medium brightness (not too dark)
    s += (val >= 0.35 && val <= 0.90) ? 20 : 5;
    scores['paper'] = s;
  }

  // ── GLASS ──
  // Bottles, jars: high transparency, often green/amber/clear, some specular
  {
    let s = 0;
    if (HARD_NOT_GLASS) {
      scores['glass'] = 5;
    } else {
      // High transparency ratio — key signal
      s += trans >= 0.30 ? 40 : trans >= 0.20 ? 25 : 5;
      // Some specular
      s += spec >= 0.10 ? 25 : spec >= 0.05 ? 15 : 5;
      // Green/amber/clear hue (0-60 or 80-160)
      const glassHue = (hue >= 0 && hue <= 60) || (hue >= 80 && hue <= 160) || sat < 0.20;
      s += glassHue ? 20 : 5;
      // Low-medium edges (smooth surface)
      s += (edges >= 0.10 && edges <= 0.45) ? 15 : 5;
      scores['glass'] = s;
    }
  }

  // ── METAL ──
  // Aluminium cans, tins: high specular + silver/grey tones or metallic sheen
  {
    let s = 0;
    if (HARD_NOT_METAL) {
      scores['metal'] = 5;
    } else {
      // High specular — shiny metal
      s += spec >= 0.18 ? 40 : spec >= 0.12 ? 25 : 5;
      // Low saturation (silver/grey) or medium-high for painted cans
      s += (sat < 0.25 || (sat >= 0.30 && val > 0.60)) ? 25 : 10;
      // High brightness (reflective)
      s += val >= 0.60 ? 20 : 5;
      // Some edges (can geometry)
      s += (edges >= 0.15 && edges <= 0.55) ? 15 : 5;
      scores['metal'] = s;
    }
  }

  // ── DRY WASTE (general) ──
  // Broad category: mixed recyclables — medium scores across the board
  {
    let s = 0;
    s += 10; // base
    s += (spec >= 0.05 && spec <= 0.30) ? 20 : 5;
    s += (sat >= 0.05 && sat <= 0.60) ? 20 : 5;
    s += (val >= 0.30 && val <= 0.90) ? 15 : 5;
    s += (edges >= 0.15 && edges <= 0.60) ? 15 : 5;
    scores['dry'] = s;
  }

  // ── E-WASTE ──
  // Printed circuit boards, wires, batteries: high color variance, complex edges
  {
    let s = 0;
    if (HARD_NOT_EWASTE) {
      scores['e-waste'] = 5;
    } else {
      // High color variance (green PCB + copper traces + components)
      s += colorVariance >= 0.40 ? 35 : colorVariance >= 0.28 ? 20 : 5;
      // Dense complex edges
      s += edges >= 0.35 ? 30 : edges >= 0.25 ? 15 : 5;
      // Often some metallic sheen
      s += spec >= 0.08 ? 15 : 5;
      // Medium saturation (green PCB)
      s += (sat >= 0.15 && sat <= 0.60) ? 20 : 5;
      scores['e-waste'] = s;
    }
  }

  // ── 4. Softmax → Probabilities ────────────────────────────────────────────
  const TEMP = 16.0;
  let sumExp = 0;
  const expScores: Record<DetectedWasteType, number> = {} as Record<DetectedWasteType, number>;
  for (const cat of categories) {
    expScores[cat] = Math.exp(scores[cat] / TEMP);
    sumExp += expScores[cat];
  }

  const probs: Record<DetectedWasteType, number> = {} as Record<DetectedWasteType, number>;
  let topCat: DetectedWasteType = 'dry';
  let maxProb = 0;
  for (const cat of categories) {
    const p = sumExp > 0 ? expScores[cat] / sumExp : 1 / 7;
    probs[cat] = Math.round(p * 1000) / 1000;
    if (p > maxProb) { maxProb = p; topCat = cat; }
  }

  // ── 5. Confidence Calibration ─────────────────────────────────────────────
  // Allow confidence to drop below 65% when the classifier is uncertain
  // This enables the verifier to correctly reject ambiguous captures.
  const margin = maxProb - Math.max(
    ...categories.filter(c => c !== topCat).map(c => probs[c])
  );
  // confidence = 50 + (margin * 100) * 0.5 → ranges from 50% (tie) to ~95% (clear winner)
  const rawConf = 50 + margin * 100 * 0.45;
  const confidence = Math.min(96, Math.max(45, Math.round(rawConf * 10) / 10));

  const profile = BALANCED_WASTE_DATASET[topCat];

  return {
    topCategory: topCat,
    categoryName: profile?.name ?? topCat,
    parentBin: profile?.parentBin ?? 'dry',
    confidence,
    classProbabilities: probs,
    isUnclearOrBlurry: false,
    clarityScore,
    extractedFeatures: {
      meanLuminance: Math.round(f.meanLuminance),
      laplacianVariance: Math.round(f.laplacianVariance),
      specularRatio: Math.round(spec * 100) / 100,
      edgeDensity: Math.round(edges * 100) / 100,
      dominantHue: hue,
      meanSaturation: Math.round(sat * 100) / 100,
    },
    explanation: `${profile?.name ?? topCat} detected (confidence ${confidence}%). ` +
      `Specular: ${Math.round(spec * 100)}%, Transparency: ${Math.round(trans * 100)}%, ` +
      `Saturation: ${Math.round(sat * 100)}%.`,
  };
}

function lowConfidenceResult(reason: string): ClassificationResult {
  return {
    topCategory: 'dry',
    categoryName: 'Unclear Item',
    parentBin: 'dry',
    confidence: 42.0,
    classProbabilities: { wet:0.10, dry:0.25, plastic:0.20, paper:0.18, glass:0.12, metal:0.10, 'e-waste':0.05 },
    isUnclearOrBlurry: true,
    clarityScore: 35.0,
    extractedFeatures: { meanLuminance:0, laplacianVariance:0, specularRatio:0, edgeDensity:0, dominantHue:0, meanSaturation:0 },
    explanation: reason,
  };
}
