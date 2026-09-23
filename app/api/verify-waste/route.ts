import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/verify-waste
 *
 * Server-side AI waste verification using Gemini Vision.
 * Falls back to a structured heuristic if no API key is configured.
 *
 * Body: FormData or JSON { imageBase64: string, mimeType: string, selectedCategory: 'wet'|'dry'|'special' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType = 'image/jpeg', selectedCategory } = body as {
      imageBase64?: string;
      mimeType?: string;
      selectedCategory: 'wet' | 'dry' | 'special';
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && imageBase64) {
      // ── Gemini Vision Path ────────────────────────────────────
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are an expert waste segregation AI for a smart city app called EcoLoop.

Analyze this image carefully and identify EXACTLY what type of waste item is shown.

The user claims this is: ${selectedCategory === 'wet' ? 'Wet/Organic Waste (food scraps, vegetable peels, cooked food)' : selectedCategory === 'dry' ? 'Dry Recyclable Waste (clean paper, cardboard, clean packaging)' : 'Special/E-Waste (electronics, batteries, hazardous items)'}

Your task:
1. Identify what the item ACTUALLY is (be specific: "plastic bottle", "banana peel", "cardboard box", etc.)
2. Classify it into ONE of these bins: wet, dry, plastic, paper, glass, metal, e-waste
3. State if the user's bin selection is CORRECT or INCORRECT

Respond ONLY with a valid JSON object in this exact format:
{
  "detectedItem": "specific item name",
  "detectedCategory": "wet|dry|plastic|paper|glass|metal|e-waste",
  "parentBin": "wet|dry|special",
  "confidence": 0-100,
  "isCorrectBin": true|false,
  "reasoning": "one sentence explanation"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
                  data: imageBase64,
                },
              },
              { text: prompt },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const rawText = response.text ?? '{}';
      // Strip markdown code fences if present
      const cleanText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleanText);

      return NextResponse.json({
        source: 'gemini',
        detectedItem: result.detectedItem || 'Unknown item',
        detectedCategory: result.detectedCategory || 'dry',
        parentBin: result.parentBin || 'dry',
        confidence: result.confidence || 75,
        isCorrectBin: result.isCorrectBin ?? false,
        reasoning: result.reasoning || '',
      });
    }

    // ── Fallback: No API key configured ──────────────────────────
    return NextResponse.json({
      source: 'fallback',
      error: 'GEMINI_API_KEY not configured. Using client-side classifier.',
    }, { status: 503 });

  } catch (err) {
    console.error('[verify-waste] Error:', err);
    return NextResponse.json({
      source: 'error',
      error: String(err),
    }, { status: 500 });
  }
}
