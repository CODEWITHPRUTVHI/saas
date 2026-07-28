import { db } from "../db";
import { getPublisher } from "../publishers/publisher-factory";

export interface ProcessQueueResult {
  totalProcessed: number;
  successfulCount: number;
  failedCount: number;
  results: Array<{
    entryId: string;
    platform: string;
    status: string;
    publishedUrl?: string;
    error?: string;
  }>;
}

/**
 * Smart Queue Engine: Finds due queue entries across brands and executes publishing
 */
export async function executePendingQueue(brandId?: string): Promise<ProcessQueueResult> {
  const now = new Date();

  // Find entries that are QUEUED or RETRYING and due
  const entries = await db.publishingQueueEntry.findMany({
    where: {
      ...(brandId ? { brandId } : {}),
      status: { in: ["QUEUED", "RETRYING"] },
      scheduledAt: { lte: now },
    },
    include: {
      contentVariant: {
        include: {
          contentItem: {
            include: {
              rawMedia: true,
            },
          },
        },
      },
      brand: {
        include: {
          socialAccounts: true,
        },
      },
    },
    take: 20,
    orderBy: { scheduledAt: "asc" },
  });

  let successfulCount = 0;
  let failedCount = 0;
  const results = [];

  for (const entry of entries) {
    // Update status to PUBLISHING
    await db.publishingQueueEntry.update({
      where: { id: entry.id },
      data: { status: "PUBLISHING" },
    });

    const variant = entry.contentVariant;
    const mediaUrl = variant.derivedMediaUrl || variant.contentItem.rawMedia?.fileUrl || "https://storage.cloud-os.io/default.mp4";

    // Find account credentials for platform
    const socialAccount = entry.brand.socialAccounts.find(
      (a) => a.platform.toUpperCase() === entry.targetPlatform.toUpperCase()
    );

    const publisher = getPublisher(entry.targetPlatform);

    const publishResult = await publisher.publish({
      queueEntryId: entry.id,
      brandId: entry.brandId,
      targetPlatform: entry.targetPlatform,
      title: variant.title || variant.contentItem.title,
      caption: variant.caption || "",
      hashtags: variant.hashtags || "",
      tags: variant.tags || "",
      mediaUrl,
      accountCredentials: socialAccount
        ? { accessToken: socialAccount.accessToken, accountHandle: socialAccount.accountHandle }
        : undefined,
    });

    if (publishResult.success) {
      successfulCount++;
      await db.publishingQueueEntry.update({
        where: { id: entry.id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          publishedUrl: publishResult.publishedUrl,
          errorLog: null,
        },
      });

      await db.contentVariant.update({
        where: { id: variant.id },
        data: { status: "PUBLISHED" },
      });

      results.push({
        entryId: entry.id,
        platform: entry.targetPlatform,
        status: "PUBLISHED",
        publishedUrl: publishResult.publishedUrl,
      });
    } else {
      failedCount++;
      const newRetryCount = entry.retryCount + 1;
      const finalStatus = newRetryCount >= 3 ? "FAILED" : "RETRYING";

      await db.publishingQueueEntry.update({
        where: { id: entry.id },
        data: {
          status: finalStatus,
          retryCount: newRetryCount,
          errorLog: publishResult.errorLog,
        },
      });

      results.push({
        entryId: entry.id,
        platform: entry.targetPlatform,
        status: finalStatus,
        error: publishResult.errorLog,
      });
    }
  }

  return {
    totalProcessed: entries.length,
    successfulCount,
    failedCount,
    results,
  };
}
