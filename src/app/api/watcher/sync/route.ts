import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { processFolderScan } from "@/lib/watcher/folder-watcher";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let connectionId = body.connectionId;

    if (!connectionId) {
      const firstConnection = await db.cloudStorageConnection.findFirst();
      if (!firstConnection) {
        return NextResponse.json({ error: "No cloud storage watcher configured." }, { status: 400 });
      }
      connectionId = firstConnection.id;
    }

    const result = await processFolderScan(connectionId);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Error running folder scan:", error);
    return NextResponse.json({ error: error.message || "Failed to process folder scan" }, { status: 500 });
  }
}
