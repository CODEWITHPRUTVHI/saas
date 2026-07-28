import { db } from "../db";
import { addDays } from "date-fns";

export interface RecycleResult {
  itemsScanned: number;
  itemsRequeued: number;
  details: Array<{ contentItemId: string; title: string; nextScheduledAt: Date; platforms: string[] }>;
}

/**
 * Evergreen Content Recycler
 * Finds published ContentItems marked isEvergreen=true,
 * checks if lastRecycledAt + recycleIntervalDays <= now,
 * and creates new PublishingQueueEntry rows for each eligible item.
 */
export async function runContentRecycler(brandId?: string): Promise<RecycleResult> {
  const now = new Date();
  let itemsRequeued = 0;
  const details: RecycleResult["details"] = [];

  // Query eligible evergreen items
  const evergreenItems = await db.contentItem.findMany({
    where: {
      ...(brandId ? { brandId } : {}),
      isEvergreen: true,
      recycleIntervalDays: { not: null },
      status: "PUBLISHED",
      OR: [
        { lastRecycledAt: null },
        // lastRecycledAt + recycleIntervalDays <= now
        {
          lastRecycledAt: {
            lte: new Date(now.getTime() - 1), // will be further filtered below
          },
        },
      ],
    },
    include: {
      variants: {
        where: { status: "PUBLISHED" },
        include: { publishingQueueEntry: { take: 1, orderBy: { publishedAt: "desc" } } },
      },
    },
  });

  for (const item of evergreenItems) {
    if (!item.recycleIntervalDays) continue;

    // Determine last recycled or published date
    const lastRecycled = item.lastRecycledAt;
    const cooldownDays = item.recycleIntervalDays;
    const cutoff = lastRecycled
      ? addDays(lastRecycled, cooldownDays)
      : addDays(now, -1); // If never recycled, treat as eligible

    if (cutoff > now) continue; // Still in cooldown

    const platforms: string[] = [];
    let variantOffset = 0;

    for (const variant of item.variants) {
      const nextScheduledAt = addDays(now, variantOffset * 1); // Stagger 1 day apart per platform
      variantOffset++;

      await db.publishingQueueEntry.create({
        data: {
          brandId: item.brandId,
          contentVariantId: variant.id,
          targetPlatform: variant.platform,
          scheduledAt: nextScheduledAt,
          status: "QUEUED",
          isRecycled: true,
          retryCount: 0,
        },
      });

      platforms.push(variant.platform);
    }

    // Update recycled timestamp
    await db.contentItem.update({
      where: { id: item.id },
      data: { lastRecycledAt: now },
    });

    itemsRequeued++;
    details.push({
      contentItemId: item.id,
      title: item.title,
      nextScheduledAt: addDays(now, 0),
      platforms,
    });
  }

  return {
    itemsScanned: evergreenItems.length,
    itemsRequeued,
    details,
  };
}
