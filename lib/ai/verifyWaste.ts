import { AIVerificationResponse } from '@/types';
import { classifyWasteImage, ClassificationResult, DetectedWasteType } from './classifier';
import { BALANCED_WASTE_DATASET } from './dataset';

/**
 * Waste Verification Engine
 * 
 * Independently identifies uploaded images across 7 balanced categories:
 * - Wet Waste
 * - Dry Waste
 * - Plastic
 * - Paper
 * - Glass
 * - Metal
 * - E-Waste
 * 
 * Strict Validation Rules:
 * 1. Selected Category = Wet Waste but image = Dry Waste / Plastic / Paper / Glass / Metal / E-Waste -> Reject and give 0 points
 * 2. Selected Category matches AI prediction with sufficient confidence (>= 70%) -> Accept and award points
 * 3. Low-confidence or unclear images (< 65% or blurry/dark) -> Reject / ask for another image and give 0 points
 * 4. Never trust the user's selected category alone: always cross-validate with independent AI prediction.
 * 5. Validate result strictly before awarding points.
 */

export interface VerifyWasteOptions {
  image?: string | File | Blob;
  selectedCategory: 'wet' | 'dry' | 'special';
  isForceContaminationDemo?: boolean;
}

export async function verifyWaste(
  imageOrOptions: string | File | Blob | VerifyWasteOptions,
  categoryParam?: 'wet' | 'dry' | 'special'
): Promise<AIVerificationResponse> {
  const options: VerifyWasteOptions =
    typeof imageOrOptions === 'object' && imageOrOptions !== null && 'selectedCategory' in imageOrOptions
      ? (imageOrOptions as VerifyWasteOptions)
      : {
          image: imageOrOptions as string | File | Blob | undefined,
          selectedCategory: categoryParam || 'wet',
        };

  // Small delay for optical feature extraction and realistic inference feedback
  await new Promise((resolve) => setTimeout(resolve, 600));

  // 1. Force Contamination Guidance Flow (Demo Trigger for Testing Empathetic Correction)
  if (options.isForceContaminationDemo) {
    return {
      detectedCategory: 'plastic',
      confidence: 89.4,
      status: 'needs_attention',
      pointsAwarded: 0,
      cleanBinBonus: 0,
      feedback: 'Segregation Mismatch: We spotted a plastic snack wrapper inside your organic waste bin. 0 points awarded until correctly sorted.',
      contaminant: 'Plastic snack wrapper / film packaging in wet bin',
      correctionPrompt: 'Move the plastic item to your blue dry-waste bin and tap re-scan. No penalty!',
      suggestedAction: 'Remove non-biodegradable wrapper before bin drop.',
      rawPrediction: 'plastic',
    };
  }

  // 2. Independently Classify the Uploaded Image
  let classification: ClassificationResult;
  try {
    classification = await classifyWasteImage(options.image);
  } catch {
    classification = {
      topCategory: 'wet',
      categoryName: 'Unclear Item',
      parentBin: 'wet',
      confidence: 45.0,
      classProbabilities: {
        wet: 0.25,
        dry: 0.20,
        plastic: 0.15,
        paper: 0.15,
        glass: 0.10,
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

  // 3. Rule: Low-confidence or unclear images -> Reject / ask for another image and give 0 points
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
      correctionPrompt: 'Please hold your camera steady in good lighting and take another photo. 0 points awarded until verified.',
      suggestedAction: 'Ensure good lighting, center the waste item, and avoid camera shake.',
      rawPrediction: classification.topCategory,
    };
  }

  const detected = classification.topCategory;
  const detectedProfile = BALANCED_WASTE_DATASET[detected];
  const detectedBin = classification.parentBin;
  const selected = options.selectedCategory;

  // 4. Validate Selected Category Against Independent AI Prediction

  // Scenario A: User selected WET WASTE
  if (selected === 'wet') {
    // If AI independently identified Wet Waste
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

    // Mismatch: Selected Wet Waste, but image is Dry Waste (Plastic, Paper, Glass, Metal, etc.)
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

    // Mismatch: Selected Wet Waste, but image is E-Waste
    if (detectedBin === 'special') {
      return {
        detectedCategory: 'e-waste',
        confidence: classification.confidence,
        status: 'needs_attention',
        pointsAwarded: 0,
        cleanBinBonus: 0,
        feedback: 'Hazardous E-Waste detected in Wet Waste bin! Electronic components and batteries are toxic to composting and soil health. 0 points awarded.',
        contaminant: 'Electronic waste / battery in organic bin',
        correctionPrompt: 'Place electronic items in the Red Sealed Hazard Bag for safe disposal.',
        suggestedAction: 'Segregate all cords and batteries into Red Special Waste.',
        rawPrediction: detected,
      };
    }
  }

  // Scenario B: User selected DRY WASTE
  if (selected === 'dry') {
    // If AI independently identified Dry Waste or a dry sub-category (Plastic, Paper, Glass, Metal)
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

    // Mismatch: Selected Dry Waste, but image is Wet Waste
    if (detectedBin === 'wet') {
      return {
        detectedCategory: 'wet',
        confidence: classification.confidence,
        status: 'needs_attention',
        pointsAwarded: 0,
        cleanBinBonus: 0,
        feedback: 'Segregation Mismatch: Wet organic food waste detected in Dry Recyclables bin. Organic moisture and oils contaminate paper and recyclables. 0 points awarded.',
        contaminant: 'Organic kitchen waste / food scraps in dry bin',
        correctionPrompt: 'Move organic food scraps to your Green Wet Waste container and tap re-scan.',
        suggestedAction: 'Keep dry recyclables completely clean, dry, and unsoiled.',
        rawPrediction: detected,
      };
    }

    // Mismatch: Selected Dry Waste, but image is E-Waste
    if (detectedBin === 'special') {
      return {
        detectedCategory: 'e-waste',
        confidence: classification.confidence,
        status: 'needs_attention',
        pointsAwarded: 0,
        cleanBinBonus: 0,
        feedback: 'Hazardous E-Waste detected in general Dry Waste bin. Electronics require dedicated recycling. 0 points awarded.',
        contaminant: 'Electronic waste / battery in dry bin',
        correctionPrompt: 'Place electronic cords or batteries into the Red Special Waste sealed bag.',
        suggestedAction: 'Keep hazardous materials separate from municipal dry recyclables.',
        rawPrediction: detected,
      };
    }
  }

  // Scenario C: User selected SPECIAL WASTE
  if (selected === 'special') {
    // If AI independently identified E-Waste / Special Waste
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

    // Mismatch: Regular household waste put into Special Hazard bag
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

  // Fallback: If unable to match with confidence, reject and give 0 points
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
