import { getPlatformAdapter, PublishingPayload, PublishingResult } from "@/lib/adapters";

export interface QueueEntry {
  id: string;
  brandId: string;
  contentVariantId: string;
  targetPlatform: string;
  title: string;
  caption: string;
  mediaUrl?: string;
  scheduledAt: string;
  status: "DRAFT" | "QUEUED" | "PUBLISHED" | "FAILED" | "CANCELLED";
  retryCount: number;
  maxRetries: number;
  publishedUrl?: string;
  errorLog?: string;
  createdAt: string;
}

// In-memory queue registry for engine operations
const QUEUE_STORE: Map<string, QueueEntry> = new Map();

export class PublishingEngine {
  /**
   * Create a new draft entry
   */
  static createDraft(payload: Partial<QueueEntry>): QueueEntry {
    const entry: QueueEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      brandId: payload.brandId || "b1",
      contentVariantId: payload.contentVariantId || `var_${Date.now()}`,
      targetPlatform: payload.targetPlatform || "YOUTUBE",
      title: payload.title || "Untitled Draft",
      caption: payload.caption || "",
      mediaUrl: payload.mediaUrl,
      scheduledAt: payload.scheduledAt || new Date().toISOString(),
      status: "DRAFT",
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date().toISOString(),
    };
    QUEUE_STORE.set(entry.id, entry);
    return entry;
  }

  /**
   * Schedule an entry for future publication
   */
  static schedule(id: string, scheduledAt: string): QueueEntry {
    const entry = QUEUE_STORE.get(id);
    if (!entry) throw new Error(`Queue entry ${id} not found.`);

    entry.scheduledAt = scheduledAt;
    entry.status = "QUEUED";
    QUEUE_STORE.set(id, entry);
    return entry;
  }

  /**
   * Publish an entry immediately using its platform adapter
   */
  static async publishNow(id: string, accessToken: string = "mock_token"): Promise<PublishingResult> {
    const entry = QUEUE_STORE.get(id);
    const adapter = getPlatformAdapter(entry?.targetPlatform || "YOUTUBE");

    const payload: PublishingPayload = {
      entryId: id,
      brandId: entry?.brandId || "b1",
      platform: entry?.targetPlatform || "YOUTUBE",
      title: entry?.title,
      caption: entry?.caption,
      mediaUrl: entry?.mediaUrl,
    };

    const result = await adapter.publish(payload, accessToken);

    if (entry) {
      if (result.success) {
        entry.status = "PUBLISHED";
        entry.publishedUrl = result.publishedUrl;
      } else {
        entry.status = "FAILED";
        entry.retryCount += 1;
        entry.errorLog = result.error;
      }
      QUEUE_STORE.set(id, entry);
    }

    return result;
  }

  /**
   * Retry a failed job
   */
  static async retryFailed(id: string): Promise<PublishingResult> {
    const entry = QUEUE_STORE.get(id);
    if (!entry) throw new Error(`Queue entry ${id} not found.`);
    if (entry.retryCount >= entry.maxRetries) {
      throw new Error(`Max retries (${entry.maxRetries}) reached for entry ${id}.`);
    }

    entry.status = "QUEUED";
    return await this.publishNow(id);
  }

  /**
   * Cancel a scheduled job
   */
  static cancel(id: string): QueueEntry {
    const entry = QUEUE_STORE.get(id);
    if (!entry) throw new Error(`Queue entry ${id} not found.`);
    entry.status = "CANCELLED";
    QUEUE_STORE.set(id, entry);
    return entry;
  }

  /**
   * Duplicate an entry
   */
  static duplicate(id: string): QueueEntry {
    const original = QUEUE_STORE.get(id);
    if (!original) throw new Error(`Queue entry ${id} not found.`);

    const duplicated: QueueEntry = {
      ...original,
      id: `entry_${Date.now()}_copy`,
      title: `${original.title} (Copy)`,
      status: "DRAFT",
      retryCount: 0,
      createdAt: new Date().toISOString(),
    };

    QUEUE_STORE.set(duplicated.id, duplicated);
    return duplicated;
  }

  /**
   * Bulk publish multiple items
   */
  static async bulkPublish(ids: string[]): Promise<{ successfulCount: number; failedCount: number }> {
    let successfulCount = 0;
    let failedCount = 0;

    for (const id of ids) {
      try {
        const res = await this.publishNow(id);
        if (res.success) successfulCount++;
        else failedCount++;
      } catch {
        failedCount++;
      }
    }

    return { successfulCount, failedCount };
  }
}
