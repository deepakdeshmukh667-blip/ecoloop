import { AIVerificationResponse } from '@/types';
import { BALANCED_WASTE_DATASET } from './dataset';

/**
 * Waste Verification Engine
 *
 * Strategy:
 *  1. If running in browser, convert image to base64 and POST to /api/verify-waste
 *     which calls Gemini Vision for accurate classification.
 *  2. If the API is unavailable (no key, network error, SSR), fall back to the
 *     improved local optical classifier.
 *
 * Strict Validation Rules:
 *  1. Selected Category = Wet Waste but image = Dry / Plastic / Paper / Glass / Metal / E-Waste → Reject, 0 pts
 *  2. Selected Category matches AI prediction with confidence ≥ 70% → Accept, award points
 *  3. Low-confidence or unclear images (< 65%) → Reject / ask for another image, 0 pts
 *  4. Never trust the user's selected category alone: always cross-validate with independent AI prediction.
 */

export interface VerifyWasteOptions {
  image?: string | File | Blob;
  selectedCategory: 'wet' | 'dry' | 'special';
  isForceContaminationDemo?: boolean;
}

// ── Helper: Convert image to base64 ──────────────────────────────────────────
async function imageToBase64(
  image: string | File | Blob
): Promise<{ base64: string; mimeType: string } | null> {
  try {
    // Already a data URL
    if (typeof image === 'string' && image.startsWith('data:')) {
      const [header, data] = image.split(',');
      const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';
      return { base64: data, mimeType };
    }

    // ObjectURL or regular URL — fetch it
    if (typeof image === 'string') {
      const resp = await fetch(image);
      const blob = await resp.blob();
      return blobToBase64(blob);
    }

    if (image instanceof Blob) {
      return blobToBase64(image);
    }

    return null;
  } catch {
    return null;
  }
}

function blobToBase64(blob: Blob): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';
      resolve({ base64: data, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ── Helper: Call server-side Gemini API route ─────────────────────────────────
interface GeminiResult {
  source: 'gemini' | 'fallback' | 'error';
  detectedItem?: string;
  detectedCategory?: string;
  parentBin?: string;
  confidence?: number;
  isCorrectBin?: boolean;
  reasoning?: string;
  error?: string;
}

async function callGeminiVerify(
  image: string | File | Blob,
  selectedCategory: 'wet' | 'dry' | 'special'
): Promise<GeminiResult | null> {
  try {
    const converted = await imageToBase64(image);
    if (!converted) return null;

    const response = await fetch('/api/verify-waste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: converted.base64,
        mimeType: converted.mimeType,
        selectedCategory,
      }),
    });

    if (!response.ok) return null;
    const data = (await response.json()) as GeminiResult;
    if (data.source === 'fallback' || data.source === 'error') return null;
    return data;
  } catch {
    return null;
  }
}

// ── Main Export ───────────────────────────────────────────────────────────────
export async function verifyWaste(
  imageOrOptions: string | File | Blob | VerifyWasteOptions,
  categoryParam?: 'wet' | 'dry' | 'special'
): Promise<AIVerificationResponse> {
  const options: VerifyWasteOptions =
    typeof imageOrOptions === 'object' &&
    imageOrOptions !== null &&
    'selectedCategory' in imageOrOptions
      ? (imageOrOptions as VerifyWasteOptions)
      : {
          image: imageOrOptions as string | File | Blob | undefined,
          selectedCategory: categoryParam || 'wet',
        };

  // Small delay for realistic inference feedback
  await new Promise((resolve) => setTimeout(resolve, 600));

  // 1. Force Contamination Guidance Flow (Demo Trigger for Testing)
  if (options.isForceContaminationDemo) {
    return {
      detectedCategory: 'plastic',
      confidence: 89.4,
      status: 'needs_attention',
      pointsAwarded: 0,
      cleanBinBonus: 0,
      feedback:
        'Segregation Mismatch: We spotted a plastic snack wrapper inside your organic waste bin. 0 points awarded until correctly sorted.',
      contaminant: 'Plastic snack wrapper / film packaging in wet bin',
      correctionPrompt:
        'Move the plastic item to your blue dry-waste bin and tap re-scan. No penalty!',
      suggestedAction: 'Remove non-biodegradable wrapper before bin drop.',
      rawPrediction: 'plastic',
    };
  }

  const selected = options.selectedCategory;

  // 2. Try Gemini Vision (server-side) first
  if (options.image && typeof window !== 'undefined') {
    const gemini = await callGeminiVerify(options.image, selected);

    if (gemini && gemini.detectedCategory && gemini.confidence !== undefined) {
      const validCategories = new Set(['wet', 'dry', 'special', 'plastic', 'paper', 'glass', 'metal', 'e-waste', 'unrecognized']);
      const detectedCat = (validCategories.has(gemini.detectedCategory) ? gemini.detectedCategory : 'unrecognized') as AIVerificationResponse['detectedCategory'];
      const detectedParentBin = (gemini.parentBin ?? 'dry') as 'wet' | 'dry' | 'special';
      const conf = gemini.confidence;
      const profile = BALANCED_WASTE_DATASET[detectedCat];

      // Low confidence → reject
      if (conf < 65) {
        return {
          detectedCategory: detectedCat,
          confidence: conf,
          status: 'rejected',
          pointsAwarded: 0,
          cleanBinBonus: 0,
          isLowConfidence: true,
          feedback: `Low confidence (${conf}%): ${gemini.reasoning || 'Could not classify clearly'}. 0 points awarded.`,
          contaminant: 'Unclear image or item',
          correctionPrompt:
            'Please hold your camera steady in good lighting and take another photo.',
          suggestedAction: 'Ensure good lighting, center the waste item, and avoid camera shake.',
          rawPrediction: detectedCat,
        };
      }

      const detectedItemLabel = gemini.detectedItem || profile?.name || detectedCat;

      // Scenario A: User selected WET WASTE
      if (selected === 'wet') {
        if (detectedParentBin === 'wet' && conf >= 70) {
          return {
            detectedCategory: 'wet',
            confidence: conf,
            status: 'verified',
            pointsAwarded: 10,
            cleanBinBonus: 5,
            feedback: `Looks correctly segregated! ${detectedItemLabel} verified as organic waste with ${conf}% confidence.`,
            suggestedAction: 'Drop in Green Compost Container. +10 Eco Points +5 Clean Bin Bonus credited!',
            rawPrediction: detectedCat,
          };
        }

        if (detectedParentBin === 'dry') {
          return {
            detectedCategory: detectedCat,
            confidence: conf,
            status: 'needs_attention',
            pointsAwarded: 0,
            cleanBinBonus: 0,
            feedback: `Segregation Mismatch: ${detectedItemLabel} detected — this belongs in the ${profile?.binName || 'Blue Recyclables Bin'}, not the Green Compost Bin. 0 points awarded.`,
            contaminant: `${detectedItemLabel} in organic bin`,
            correctionPrompt: `Move the ${detectedItemLabel.toLowerCase()} to your Blue Dry Recyclables container and tap re-scan.`,
            suggestedAction: 'Remove non-biodegradable items before depositing in the green bin.',
            rawPrediction: detectedCat,
          };
        }

        if (detectedParentBin === 'special') {
          return {
            detectedCategory: 'e-waste',
            confidence: conf,
            status: 'needs_attention',
            pointsAwarded: 0,
            cleanBinBonus: 0,
            feedback:
              'Hazardous E-Waste detected in Wet Waste bin! Electronic components and batteries are toxic to composting and soil health. 0 points awarded.',
            contaminant: 'Electronic waste / battery in organic bin',
            correctionPrompt: 'Place electronic items in the Red Sealed Hazard Bag for safe disposal.',
            suggestedAction: 'Segregate all cords and batteries into Red Special Waste.',
            rawPrediction: detectedCat,
          };
        }
      }

      // Scenario B: User selected DRY WASTE
      if (selected === 'dry') {
        if (detectedParentBin === 'dry' && conf >= 70) {
          return {
            detectedCategory: detectedCat,
            confidence: conf,
            status: 'verified',
            pointsAwarded: 10,
            cleanBinBonus: 5,
            feedback: `Looks correctly segregated! ${detectedItemLabel} verified with ${conf}% confidence.`,
            suggestedAction: 'Drop in Blue Recyclables Container. +10 Eco Points +5 Clean Bin Bonus credited!',
            rawPrediction: detectedCat,
          };
        }

        if (detectedParentBin === 'wet') {
          return {
            detectedCategory: 'wet',
            confidence: conf,
            status: 'needs_attention',
            pointsAwarded: 0,
            cleanBinBonus: 0,
            feedback:
              'Segregation Mismatch: Wet organic food waste detected in Dry Recyclables bin. Organic moisture and oils contaminate paper and recyclables. 0 points awarded.',
            contaminant: 'Organic kitchen waste / food scraps in dry bin',
            correctionPrompt:
              'Move organic food scraps to your Green Wet Waste container and tap re-scan.',
            suggestedAction: 'Keep dry recyclables completely clean, dry, and unsoiled.',
            rawPrediction: detectedCat,
          };
        }

        if (detectedParentBin === 'special') {
          return {
            detectedCategory: 'e-waste',
            confidence: conf,
            status: 'needs_attention',
            pointsAwarded: 0,
            cleanBinBonus: 0,
            feedback:
              'Hazardous E-Waste detected in general Dry Waste bin. Electronics require dedicated recycling. 0 points awarded.',
            contaminant: 'Electronic waste / battery in dry bin',
            correctionPrompt:
              'Place electronic cords or batteries into the Red Special Waste sealed bag.',
            suggestedAction: 'Keep hazardous materials separate from municipal dry recyclables.',
            rawPrediction: detectedCat,
          };
        }
      }

      // Scenario C: User selected SPECIAL WASTE
      if (selected === 'special') {
        if (detectedParentBin === 'special' && conf >= 70) {
          return {
            detectedCategory: 'e-waste',
            confidence: conf,
            status: 'verified',
            pointsAwarded: 15,
            cleanBinBonus: 5,
            feedback: `Special Hazard / E-Waste verified safely (${detectedItemLabel}). +15 Eco Points credited!`,
            suggestedAction: 'Drop in Red Sealed Hazard Bag for safe municipal handling.',
            rawPrediction: detectedCat,
          };
        }

        return {
          detectedCategory: detectedCat,
          confidence: conf,
          status: 'needs_attention',
          pointsAwarded: 0,
          cleanBinBonus: 0,
          feedback: `Standard household waste (${detectedItemLabel}) placed in hazardous Special Waste bag. Please use regular green or blue bins. 0 points awarded.`,
          contaminant: `${detectedItemLabel} in special hazard bag`,
          correctionPrompt: `Move this item to the appropriate ${detectedParentBin === 'wet' ? 'Green' : 'Blue'} bin.`,
          suggestedAction: 'Reserve the Red bag strictly for electronics, batteries, and hazardous items.',
          rawPrediction: detectedCat,
        };
      }
    }
  }

  // 3. Fallback: No image or Gemini unavailable
  // Use the local optical classifier as a last resort
  const { classifyWasteImage } = await import('./classifier');

  let classification;
  try {
    classification = await classifyWasteImage(options.image);
  } catch {
    classification = {
      topCategory: 'dry' as const,
      categoryName: 'Unclear Item',
      parentBin: 'dry' as const,
      confidence: 45.0,
      classProbabilities: {
        wet: 0.10,
        dry: 0.25,
        plastic: 0.20,
        paper: 0.18,
        glass: 0.12,
        metal: 0.10,
        'e-waste': 0.05,
      },
      isUnclearOrBlurry: true,
      clarityScore: 40,
      extractedFeatures: {
        meanLuminance: 0,
        laplacianVariance: 0,
        specularRatio: 0,
        edgeDensity: 0,
        dominantHue: 0,
        meanSaturation: 0,
      },
      explanation: 'Could not decode image features clearly.',
    };
  }

  // Low confidence / blurry → always reject
  if (classification.isUnclearOrBlurry || classification.confidence < 65) {
    return {
      detectedCategory: classification.topCategory,
      confidence: classification.confidence,
      status: 'rejected',
      pointsAwarded: 0,
      cleanBinBonus: 0,
      isLowConfidence: true,
      feedback: `Low confidence (${classification.confidence}%): ${classification.explanation} 0 points awarded.`,
      contaminant: 'Unclear or blurry image capture',
      correctionPrompt:
        'Please hold your camera steady in good lighting and take another photo. 0 points awarded until verified.',
      suggestedAction: 'Ensure good lighting, center the waste item, and avoid camera shake.',
      rawPrediction: classification.topCategory,
    };
  }

  const detected = classification.topCategory;
  const detectedProfile = BALANCED_WASTE_DATASET[detected];
  const detectedBin = classification.parentBin;

  if (selected === 'wet') {
    if (detectedBin === 'wet' && classification.confidence >= 70) {
      return {
        detectedCategory: 'wet',
        confidence: classification.confidence,
        status: 'verified',
        pointsAwarded: 10,
        cleanBinBonus: 5,
        feedback: `Looks correctly segregated! Clean organic food scraps & vegetable peels verified with ${classification.confidence}% confidence.`,
        suggestedAction: 'Drop in Green Compost Container. +10 Eco Points +5 Clean Bin Bonus credited!',
        rawPrediction: detected,
      };
    }

    if (detectedBin === 'dry') {
      return {
        detectedCategory: detected,
        confidence: classification.confidence,
        status: 'needs_attention',
        pointsAwarded: 0,
        cleanBinBonus: 0,
        feedback: `Segregation Mismatch: ${detectedProfile?.name || 'Dry recyclable material'} detected inside your Wet Waste bin. Dry packaging cannot be composted. 0 points awarded.`,
        contaminant: `${detectedProfile?.name || 'Dry Recyclable Item'} in organic bin`,
        correctionPrompt: `Move the ${detectedProfile?.name.toLowerCase() || 'dry recyclable'} to your Blue Dry Recyclables container and tap re-scan.`,
        suggestedAction: 'Remove non-biodegradable items before depositing in the green bin.',
        rawPrediction: detected,
      };
    }

    if (detectedBin === 'special') {
      return {
        detectedCategory: 'e-waste',
        confidence: classification.confidence,
        status: 'needs_attention',
        pointsAwarded: 0,
        cleanBinBonus: 0,
        feedback:
          'Hazardous E-Waste detected in Wet Waste bin! Electronic components and batteries are toxic to composting and soil health. 0 points awarded.',
        contaminant: 'Electronic waste / battery in organic bin',
        correctionPrompt: 'Place electronic items in the Red Sealed Hazard Bag for safe disposal.',
        suggestedAction: 'Segregate all cords and batteries into Red Special Waste.',
        rawPrediction: detected,
      };
    }
  }

  if (selected === 'dry') {
    if (detectedBin === 'dry' && classification.confidence >= 70) {
      return {
        detectedCategory: detected,
        confidence: classification.confidence,
        status: 'verified',
        pointsAwarded: 10,
        cleanBinBonus: 5,
        feedback: `Looks correctly segregated! Clean ${detectedProfile?.name || 'dry recyclables'} verified with ${classification.confidence}% confidence.`,
        suggestedAction: 'Drop in Blue Recyclables Container. +10 Eco Points +5 Clean Bin Bonus credited!',
        rawPrediction: detected,
      };
    }

    if (detectedBin === 'wet') {
      return {
        detectedCategory: 'wet',
        confidence: classification.confidence,
        status: 'needs_attention',
        pointsAwarded: 0,
        cleanBinBonus: 0,
        feedback:
          'Segregation Mismatch: Wet organic food waste detected in Dry Recyclables bin. Organic moisture and oils contaminate paper and recyclables. 0 points awarded.',
        contaminant: 'Organic kitchen waste / food scraps in dry bin',
        correctionPrompt:
          'Move organic food scraps to your Green Wet Waste container and tap re-scan.',
        suggestedAction: 'Keep dry recyclables completely clean, dry, and unsoiled.',
        rawPrediction: detected,
      };
    }

    if (detectedBin === 'special') {
      return {
        detectedCategory: 'e-waste',
        confidence: classification.confidence,
        status: 'needs_attention',
        pointsAwarded: 0,
        cleanBinBonus: 0,
        feedback:
          'Hazardous E-Waste detected in general Dry Waste bin. Electronics require dedicated recycling. 0 points awarded.',
        contaminant: 'Electronic waste / battery in dry bin',
        correctionPrompt:
          'Place electronic cords or batteries into the Red Special Waste sealed bag.',
        suggestedAction: 'Keep hazardous materials separate from municipal dry recyclables.',
        rawPrediction: detected,
      };
    }
  }

  if (selected === 'special') {
    if (detectedBin === 'special' && classification.confidence >= 70) {
      return {
        detectedCategory: 'e-waste',
        confidence: classification.confidence,
        status: 'verified',
        pointsAwarded: 15,
        cleanBinBonus: 5,
        feedback: `Special Hazard / E-Waste verified safely (${detectedProfile?.name || 'E-Waste'}). +15 Eco Points credited!`,
        suggestedAction: 'Drop in Red Sealed Hazard Bag for safe municipal handling.',
        rawPrediction: detected,
      };
    }

    return {
      detectedCategory: detected,
      confidence: classification.confidence,
      status: 'needs_attention',
      pointsAwarded: 0,
      cleanBinBonus: 0,
      feedback: `Standard household waste (${detectedProfile?.name || 'regular waste'}) placed in hazardous Special Waste bag. Please use regular green or blue bins. 0 points awarded.`,
      contaminant: `${detectedProfile?.name || 'Non-hazardous item'} in special hazard bag`,
      correctionPrompt: `Move this item to the appropriate ${detectedBin === 'wet' ? 'Green' : 'Blue'} bin.`,
      suggestedAction: 'Reserve the Red bag strictly for electronics, batteries, and hazardous items.',
      rawPrediction: detected,
    };
  }

  // Final fallback
  return {
    detectedCategory: detected,
    confidence: classification.confidence,
    status: 'needs_attention',
    pointsAwarded: 0,
    cleanBinBonus: 0,
    feedback: 'Waste segregation could not be validated with sufficient certainty. 0 points awarded.',
    correctionPrompt: 'Please verify the waste category and capture a clear photo.',
    suggestedAction: 'Re-scan with proper lighting and angle.',
    rawPrediction: detected,
  };
}
