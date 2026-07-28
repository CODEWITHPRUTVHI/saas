import { NextResponse } from "next/server";
import { executeBulkOperation, BulkOperationType } from "@/lib/bulk/bulk-operations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workspaceId, operationType, contentItemIds, variantIds, payload, initiatedBy } = body;
    if (!workspaceId || !operationType) {
      return NextResponse.json({ error: "workspaceId and operationType are required." }, { status: 400 });
    }
    const result = await executeBulkOperation({ workspaceId, operationType: operationType as BulkOperationType, contentItemIds, variantIds, payload, initiatedBy });
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
