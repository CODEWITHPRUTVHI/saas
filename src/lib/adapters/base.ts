// ── Platform Publishing Adapter Interface ──────────────────────────────────────

export interface PublishingPayload {
  entryId: string;
  brandId: string;
  platform: string;
  title?: string;
  caption?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  scheduledAt?: string;
}

export interface PublishingResult {
  success: boolean;
  publishedUrl?: string;
  platformPostId?: string;
  error?: string;
  retryable?: boolean;
  timestamp: string;
}

export interface IPlatformAdapter {
  platformName: string;
  publish(payload: PublishingPayload, accessToken: string): Promise<PublishingResult>;
  validatePayload(payload: PublishingPayload): { valid: boolean; reason?: string };
}

// ── Base Adapter Registry ───────────────────────────────────────────────────

export class BasePlatformAdapter implements IPlatformAdapter {
  platformName: string;

  constructor(platformName: string) {
    this.platformName = platformName;
  }

  validatePayload(payload: PublishingPayload): { valid: boolean; reason?: string } {
    if (!payload.mediaUrl && !payload.caption && !payload.title) {
      return { valid: false, reason: "Payload must contain mediaUrl, caption, or title." };
    }
    return { valid: true };
  }

  async publish(payload: PublishingPayload, accessToken: string): Promise<PublishingResult> {
    const validation = this.validatePayload(payload);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.reason,
        retryable: false,
        timestamp: new Date().toISOString(),
      };
    }

    // Default simulation / API dispatch structure for platform
    const postId = `${this.platformName.toLowerCase()}_post_${Date.now()}`;
    return {
      success: true,
      platformPostId: postId,
      publishedUrl: `https://${this.platformName.toLowerCase()}.com/p/${postId}`,
      timestamp: new Date().toISOString(),
    };
  }
}
