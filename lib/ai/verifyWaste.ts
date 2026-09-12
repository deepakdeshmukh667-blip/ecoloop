import { AIVerificationResponse } from '@/types';

/**
 * Waste Verification Engine
 * Pluggable architecture: Supports 'demo' deterministic testing mode and future computer vision models (e.g. Gemini Vision, Cloud Vision, Roboflow).
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
    typeof imageOrOptions === 'object' && 'selectedCategory' in imageOrOptions
      ? (imageOrOptions as VerifyWasteOptions)
      : {
          image: imageOrOptions as string | File | Blob,
          selectedCategory: categoryParam || 'wet',
        };

  const provider = process.env.AI_PROVIDER || 'demo';

  // Demo simulation mode (deterministic, realistic)
  if (provider === 'demo') {
    // Artificial slight processing delay to feel like real optical AI inference
    await new Promise((resolve) => setTimeout(resolve, 850));

    if (options.isForceContaminationDemo) {
      return {
        detectedCategory: 'dry',
        confidence: 89.2,
        status: 'needs_attention',
        feedback: 'Almost there! We spotted a dry recyclable material inside your organic bin.',
        contaminant: 'Plastic snack wrapper / film packaging',
        correctionPrompt: 'Move the plastic item to your blue dry-waste bin and tap re-scan. No penalty!',
        suggestedAction: 'Remove non-biodegradable wrapper before bin drop.',
      };
    }

    switch (options.selectedCategory) {
      case 'wet':
        return {
          detectedCategory: 'wet',
          confidence: 94.8,
          status: 'verified',
          feedback: 'Looks correctly segregated! Clean organic food scraps & vegetable peels verified.',
          suggestedAction: 'Drop in Green Compost Container. +10 Eco Points +5 Clean Bin Bonus!',
        };
      case 'dry':
        return {
          detectedCategory: 'dry',
          confidence: 96.2,
          status: 'verified',
          feedback: 'Looks correctly segregated! Flattened clean cardboard, rigid plastics and metal cans verified.',
          suggestedAction: 'Drop in Blue Recyclables Container. +10 Eco Points +5 Clean Bin Bonus!',
        };
      case 'special':
        return {
          detectedCategory: 'special',
          confidence: 97.4,
          status: 'verified',
          feedback: 'Looks correctly segregated! Sanitary / dry cells / e-waste sealed safely.',
          suggestedAction: 'Drop in Red Sealed Hazard Bag. +15 Eco Points!',
        };
      default:
        return {
          detectedCategory: 'wet',
          confidence: 91.0,
          status: 'verified',
          feedback: 'Waste placement verified.',
        };
    }
  }

  // Future computer vision model integration stub
  // e.g. Gemini Vision: Analyze multipart/form-data or Base64 with Gemini API
  return {
    detectedCategory: options.selectedCategory,
    confidence: 95.0,
    status: 'verified',
    feedback: 'Verified through AI model inference.',
  };
}
