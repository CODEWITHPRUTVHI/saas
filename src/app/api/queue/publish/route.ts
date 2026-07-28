import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { executePendingQueue } from "@/lib/queue/smart-queue";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { brandId } = body;

    const result = await executePendingQueue(brandId);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Error executing queue:", error);
    return NextResponse.json({ error: error.message || "Failed to execute queue" }, { status: 500 });
  }
}
