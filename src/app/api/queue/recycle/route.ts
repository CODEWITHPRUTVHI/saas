import { NextResponse } from "next/server";
import { runContentRecycler } from "@/lib/queue/content-recycler";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { brandId } = body;
    const result = await runContentRecycler(brandId);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
