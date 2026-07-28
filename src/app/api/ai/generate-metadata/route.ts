import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { generateSeoMetadata } from "@/lib/ai/seo-generator";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transcript, brandId, brandVoiceProfile } = body;

    if (!transcript) {
      return NextResponse.json({ error: "Transcript or description is required." }, { status: 400 });
    }

    const startTime = Date.now();
    const seoOutput = await generateSeoMetadata({
      transcriptOrDescription: transcript,
      brandVoiceProfile,
    });
    const durationMs = Date.now() - startTime;

    if (brandId) {
      await db.aiJob.create({
        data: {
          brandId,
          jobType: "SEO_METADATA",
          status: "COMPLETED",
          promptPayload: JSON.stringify({ transcript, brandVoiceProfile }),
          outputPayload: JSON.stringify(seoOutput),
          costCredits: 2,
          durationMs,
        },
      });
    }

    return NextResponse.json({ success: true, metadata: seoOutput, durationMs });
  } catch (error: any) {
    console.error("AI SEO Metadata error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate metadata" }, { status: 500 });
  }
}
