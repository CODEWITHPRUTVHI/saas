import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { advanceWorkflowStage, ApprovalStage } from "@/lib/rbac/approval-workflow";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contentItemId, toStage, userId = "system", rejectionReason } = body;
    if (!contentItemId || !toStage) {
      return NextResponse.json({ error: "contentItemId and toStage are required." }, { status: 400 });
    }
    const result = await advanceWorkflowStage(contentItemId, toStage as ApprovalStage, userId, rejectionReason);
    return NextResponse.json({ success: result.success, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const stage = searchParams.get("stage");

    const items = await db.contentItem.findMany({
      where: {
        ...(stage ? { approvalStage: stage } : { approvalStage: { in: ["SUBMITTED", "EDITOR_REVIEW", "MANAGER_REVIEW", "OWNER_APPROVED"] } }),
        brand: workspaceId ? { workspaceId } : undefined,
      },
      include: { brand: true, rawMedia: true },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
