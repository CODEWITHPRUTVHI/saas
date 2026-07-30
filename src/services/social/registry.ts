import { ISocialAccountAdapter } from "./adapter-interface";
import { BaseSocialAdapter } from "./adapters/base-adapter";

export class YouTubeAdapter extends BaseSocialAdapter {
  constructor() { super("YOUTUBE"); }
  async getPermissions(): Promise<string[]> {
    return ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"];
  }
}

export class InstagramAdapter extends BaseSocialAdapter {
  constructor() { super("INSTAGRAM"); }
  async getPermissions(): Promise<string[]> {
    return ["instagram_basic", "instagram_content_publish", "pages_read_engagement"];
  }
}

export class FacebookAdapter extends BaseSocialAdapter {
  constructor() { super("FACEBOOK"); }
  async getPermissions(): Promise<string[]> {
    return ["pages_show_list", "pages_manage_posts", "pages_read_engagement"];
  }
}

export class ThreadsAdapter extends BaseSocialAdapter {
  constructor() { super("THREADS"); }
  async getPermissions(): Promise<string[]> {
    return ["threads_basic", "threads_content_publish"];
  }
}

export class LinkedInAdapter extends BaseSocialAdapter {
  constructor() { super("LINKEDIN"); }
  async getPermissions(): Promise<string[]> {
    return ["w_member_social", "r_organization_social", "w_organization_social"];
  }
}

export class PinterestAdapter extends BaseSocialAdapter {
  constructor() { super("PINTEREST"); }
  async getPermissions(): Promise<string[]> {
    return ["boards:read", "pins:read", "pins:write"];
  }
}

export class TikTokAdapter extends BaseSocialAdapter {
  constructor() { super("TIKTOK"); }
  async getPermissions(): Promise<string[]> {
    return ["video.upload", "user.info.basic"];
  }
}

export class XAdapter extends BaseSocialAdapter {
  constructor() { super("X"); }
  async getPermissions(): Promise<string[]> {
    return ["tweet.read", "tweet.write", "users.read", "offline.access"];
  }
}

export class TelegramAdapter extends BaseSocialAdapter {
  constructor() { super("TELEGRAM"); }
  async getPermissions(): Promise<string[]> {
    return ["bot_posts", "channel_manage"];
  }
}

export class WhatsAppAdapter extends BaseSocialAdapter {
  constructor() { super("WHATSAPP"); }
  async getPermissions(): Promise<string[]> {
    return ["whatsapp_business_messaging", "whatsapp_business_management"];
  }
}

// ── Registry Factory ─────────────────────────────────────────────────────────

const ADAPTER_REGISTRY: Record<string, ISocialAccountAdapter> = {
  YOUTUBE: new YouTubeAdapter(),
  INSTAGRAM: new InstagramAdapter(),
  FACEBOOK: new FacebookAdapter(),
  THREADS: new ThreadsAdapter(),
  LINKEDIN: new LinkedInAdapter(),
  PINTEREST: new PinterestAdapter(),
  TIKTOK: new TikTokAdapter(),
  X: new XAdapter(),
  TELEGRAM: new TelegramAdapter(),
  WHATSAPP: new WhatsAppAdapter(),
};

export function getSocialAccountAdapter(platform: string): ISocialAccountAdapter {
  const normalized = platform.toUpperCase();
  return ADAPTER_REGISTRY[normalized] || new BaseSocialAdapter(normalized);
}
