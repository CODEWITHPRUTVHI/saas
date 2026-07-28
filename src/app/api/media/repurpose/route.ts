import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { generateAllPlatformCuts } from "@/lib/media/video-repurposer";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceUrl, targetPlatforms, smartCropMode = "center", brandId } = body;

    if (!sourceUrl || !targetPlatforms?.length) {
      return NextResponse.json({ error: "sourceUrl and targetPlatforms are required." }, { status: 400 });
    }

    const startTime = Date.now();
    const results = await generateAllPlatformCuts(sourceUrl, targetPlatforms, smartCropMode);
    const durationMs = Date.now() - startTime;

    if (brandId) {
      await db.aiJob.create({
        data: {
          brandId,
          jobType: "VIDEO_REPURPOSE",
          status: "COMPLETED",
          promptPayload: JSON.stringify({ sourceUrl, targetPlatforms, smartCropMode }),
          outputPayload: JSON.stringify({ cutsGenerated: results.length }),
          costCredits: results.length * 2,
          durationMs,
        },
      });
    }

    return NextResponse.json({ success: true, results, durationMs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
