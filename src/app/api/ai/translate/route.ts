import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { translateContent, LanguageCode } from "@/lib/ai/translation-engine";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceText, targetLanguages, brandId, brandVoiceProfile, brandName } = body;

    if (!sourceText || !targetLanguages?.length) {
      return NextResponse.json({ error: "sourceText and targetLanguages are required." }, { status: 400 });
    }

    const startTime = Date.now();
    const result = await translateContent({
      sourceText,
      targetLanguages: targetLanguages as LanguageCode[],
      brandVoiceProfile,
      brandName,
    });
    const durationMs = Date.now() - startTime;

    if (brandId) {
      await db.aiJob.create({
        data: {
          brandId,
          jobType: "TRANSLATION",
          status: "COMPLETED",
          promptPayload: JSON.stringify({ sourceText, targetLanguages }),
          outputPayload: JSON.stringify(result),
          costCredits: targetLanguages.length * 2,
          durationMs,
        },
      });
    }

    return NextResponse.json({ success: true, translations: result, durationMs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
