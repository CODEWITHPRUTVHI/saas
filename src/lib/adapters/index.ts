import { BasePlatformAdapter, type IPlatformAdapter, type PublishingPayload, type PublishingResult } from "./base";
export * from "./base";



export class YouTubeAdapter extends BasePlatformAdapter {
  constructor() {
    super("YOUTUBE");
  }

  validatePayload(payload: PublishingPayload): { valid: boolean; reason?: string } {
    if (!payload.title) {
      return { valid: false, reason: "YouTube requires a video title." };
    }
    return super.validatePayload(payload);
  }
}

export class InstagramAdapter extends BasePlatformAdapter {
  constructor() {
    super("INSTAGRAM");
  }
}

export class FacebookAdapter extends BasePlatformAdapter {
  constructor() {
    super("FACEBOOK");
  }
}

export class ThreadsAdapter extends BasePlatformAdapter {
  constructor() {
    super("THREADS");
  }
}

export class LinkedInAdapter extends BasePlatformAdapter {
  constructor() {
    super("LINKEDIN");
  }
}

export class PinterestAdapter extends BasePlatformAdapter {
  constructor() {
    super("PINTEREST");
  }
}

export class XAdapter extends BasePlatformAdapter {
  constructor() {
    super("X");
  }

  validatePayload(payload: PublishingPayload): { valid: boolean; reason?: string } {
    if (payload.caption && payload.caption.length > 280) {
      return { valid: false, reason: "X (Twitter) posts must be under 280 characters without Premium." };
    }
    return super.validatePayload(payload);
  }
}

export class TelegramAdapter extends BasePlatformAdapter {
  constructor() {
    super("TELEGRAM");
  }
}

export class WhatsAppAdapter extends BasePlatformAdapter {
  constructor() {
    super("WHATSAPP");
  }
}

// ── Platform Adapter Factory ──────────────────────────────────────────────────

const ADAPTER_REGISTRY: Record<string, IPlatformAdapter> = {
  YOUTUBE: new YouTubeAdapter(),
  INSTAGRAM: new InstagramAdapter(),
  FACEBOOK: new FacebookAdapter(),
  THREADS: new ThreadsAdapter(),
  LINKEDIN: new LinkedInAdapter(),
  PINTEREST: new PinterestAdapter(),
  X: new XAdapter(),
  TELEGRAM: new TelegramAdapter(),
  WHATSAPP: new WhatsAppAdapter(),
};

export function getPlatformAdapter(platform: string): IPlatformAdapter {
  const normalized = platform.toUpperCase();
  const adapter = ADAPTER_REGISTRY[normalized];
  if (!adapter) {
    // Fallback to base adapter for dynamic platforms
    return new BasePlatformAdapter(normalized);
  }
  return adapter;
}
