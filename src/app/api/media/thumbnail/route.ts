import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { generateThumbnailCandidates } from "@/lib/media/thumbnail-generator";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mediaUrl, durationSeconds = 180, candidateCount = 8, contentTitle = "", brandId, brandName = "" } = body;

    const startTime = Date.now();
    const result = await generateThumbnailCandidates(mediaUrl, durationSeconds, candidateCount, contentTitle, brandName);
    const durationMs = Date.now() - startTime;

    if (brandId) {
      await db.aiJob.create({
        data: {
          brandId,
          jobType: "THUMBNAIL_RANK",
          status: "COMPLETED",
          promptPayload: JSON.stringify({ mediaUrl, durationSeconds, candidateCount, contentTitle }),
          outputPayload: JSON.stringify({ selectedTimestamp: result.selectedThumbnailTimestamp, totalCandidates: result.rankedCandidates.length }),
          costCredits: 1,
          durationMs,
        },
      });
    }

    return NextResponse.json({ success: true, result, durationMs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
