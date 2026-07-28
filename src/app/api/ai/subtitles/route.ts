import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { generateSubtitles } from "@/lib/ai/subtitle-generator";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mediaUrl, durationSeconds = 180, language = "en", brandId, contentItemId } = body;

    if (!mediaUrl) {
      return NextResponse.json({ error: "mediaUrl is required." }, { status: 400 });
    }

    const startTime = Date.now();
    const result = await generateSubtitles(mediaUrl, durationSeconds, language);
    const durationMs = Date.now() - startTime;

    if (brandId) {
      await db.aiJob.create({
        data: {
          brandId,
          jobType: "SUBTITLE_GEN",
          status: "COMPLETED",
          promptPayload: JSON.stringify({ mediaUrl, durationSeconds, language }),
          outputPayload: JSON.stringify({ wordCount: result.wordCount, cueCount: result.cues.length }),
          costCredits: 4,
          durationMs,
        },
      });
    }

    return NextResponse.json({ success: true, result, durationMs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
