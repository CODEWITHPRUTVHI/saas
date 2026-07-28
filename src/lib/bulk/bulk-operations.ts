import { db } from "../db";

export type BulkOperationType =
  | "BULK_PUBLISH"
  | "BULK_SCHEDULE"
  | "BULK_TAG"
  | "BULK_DELETE"
  | "BULK_METADATA_UPDATE";

export interface BulkOperationInput {
  workspaceId: string;
  operationType: BulkOperationType;
  contentItemIds?: string[];
  variantIds?: string[];
  payload?: Record<string, unknown>;
  initiatedBy?: string;
}

export interface BulkOperationResult {
  operationId: string;
  operationType: BulkOperationType;
  targetCount: number;
  successCount: number;
  failedCount: number;
  status: string;
  details: string[];
}

// ─── Bulk Operations Engine ───────────────────────────────────────────────────
export async function executeBulkOperation(input: BulkOperationInput): Promise<BulkOperationResult> {
  const { workspaceId, operationType, contentItemIds = [], variantIds = [], payload = {}, initiatedBy } = input;

  // Create operation record
  const operation = await db.bulkOperation.create({
    data: {
      workspaceId,
      operationType,
      status: "RUNNING",
      targetCount: contentItemIds.length || variantIds.length,
      initiatedBy,
      payload: JSON.stringify(payload),
    },
  });

  let successCount = 0;
  let failedCount = 0;
  const details: string[] = [];

  try {
    switch (operationType) {
      case "BULK_TAG": {
        const tags = (payload.tags as string[])?.join(",") ?? "";
        for (const assetId of contentItemIds) {
          try {
            await db.mediaAsset.updateMany({ where: { id: assetId }, data: { tags } });
            successCount++;
            details.push(`Tagged asset ${assetId}`);
          } catch { failedCount++; }
        }
        break;
      }

      case "BULK_SCHEDULE": {
        const scheduledAt = payload.scheduledAt ? new Date(payload.scheduledAt as string) : new Date();
        for (const variantId of variantIds) {
          try {
            await db.publishingQueueEntry.updateMany({
              where: { contentVariantId: variantId, status: "QUEUED" },
              data: { scheduledAt },
            });
            successCount++;
            details.push(`Rescheduled variant ${variantId} to ${scheduledAt.toISOString()}`);
          } catch { failedCount++; }
        }
        break;
      }

      case "BULK_METADATA_UPDATE": {
        for (const itemId of contentItemIds) {
          try {
            const updateData: any = {};
            if (payload.title) updateData.title = payload.title;
            if (payload.description) updateData.description = payload.description;
            await db.contentItem.update({ where: { id: itemId }, data: updateData });
            successCount++;
            details.push(`Updated metadata for item ${itemId}`);
          } catch { failedCount++; }
        }
        break;
      }

      case "BULK_DELETE": {
        for (const itemId of contentItemIds) {
          try {
            await db.contentItem.delete({ where: { id: itemId } });
            successCount++;
            details.push(`Deleted content item ${itemId}`);
          } catch { failedCount++; }
        }
        break;
      }

      case "BULK_PUBLISH": {
        // Mark variants as QUEUED with immediate schedule
        const now = new Date();
        for (const variantId of variantIds) {
          try {
            const variant = await db.contentVariant.findUnique({
              where: { id: variantId },
              include: { contentItem: true },
            });
            if (!variant) continue;

            await db.publishingQueueEntry.create({
              data: {
                brandId: variant.contentItem.brandId,
                contentVariantId: variantId,
                targetPlatform: variant.platform,
                scheduledAt: now,
                status: "QUEUED",
                bulkOperationId: operation.id,
              },
            });
            successCount++;
            details.push(`Queued variant ${variantId} for immediate publish`);
          } catch { failedCount++; }
        }
        break;
      }
    }

    // Update operation record
    await db.bulkOperation.update({
      where: { id: operation.id },
      data: {
        status: failedCount === 0 ? "COMPLETED" : successCount === 0 ? "FAILED" : "PARTIAL",
        successCount,
        failedCount,
        completedAt: new Date(),
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        workspaceId,
        userId: initiatedBy,
        action: `BULK_OPERATION:${operationType}`,
        entityType: "BULK_OPERATION",
        entityId: operation.id,
        details: `${successCount}/${successCount + failedCount} succeeded`,
      },
    });

  } catch (err: any) {
    await db.bulkOperation.update({
      where: { id: operation.id },
      data: { status: "FAILED", errorLog: err.message, completedAt: new Date() },
    });
  }

  return {
    operationId: operation.id,
    operationType,
    targetCount: contentItemIds.length || variantIds.length,
    successCount,
    failedCount,
    status: failedCount === 0 ? "COMPLETED" : successCount === 0 ? "FAILED" : "PARTIAL",
    details,
  };
}
