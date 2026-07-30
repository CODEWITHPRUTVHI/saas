import { encryptToken, decryptToken } from "@/lib/security/encryption";

export type SocialPlatform =
  | "YOUTUBE"
  | "INSTAGRAM"
  | "FACEBOOK text"
  | "FACEBOOK"
  | "THREADS"
  | "LINKEDIN"
  | "PINTEREST"
  | "X"
  | "TELEGRAM"
  | "WHATSAPP";

export interface ConnectedAccount {
  id: string;
  brandId: string;
  platform: SocialPlatform;
  accountName: string;
  accountHandle: string;
  accountAvatar?: string;
  encryptedAccessToken: string;
  encryptedRefreshToken?: string;
  tokenExpiresAt?: string;
  status: "ACTIVE" | "EXPIRED" | "DISCONNECTED" | "ERROR";
  healthScore: number; // 0 - 100
  lastHealthCheck: string;
  followerCount: number;
  scopes: string[];
  connectedAt: string;
}

export const SUPPORTED_PLATFORMS: Record<
  string,
  { name: string; icon: string; brandColor: string; requiredScopes: string[] }
> = {
  YOUTUBE: {
    name: "YouTube",
    icon: "▶",
    brandColor: "#FF0000",
    requiredScopes: ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"],
  },
  INSTAGRAM: {
    name: "Instagram Professional",
    icon: "IG",
    brandColor: "#E1306C",
    requiredScopes: ["instagram_basic", "instagram_content_publish", "pages_read_engagement"],
  },
  FACEBOOK: {
    name: "Facebook Pages",
    icon: "f",
    brandColor: "#1877F2",
    requiredScopes: ["pages_show_list", "pages_manage_posts", "pages_read_engagement"],
  },
  THREADS: {
    name: "Threads API",
    icon: "🧵",
    brandColor: "#000000",
    requiredScopes: ["threads_basic", "threads_content_publish"],
  },
  LINKEDIN: {
    name: "LinkedIn Member & Org",
    icon: "in",
    brandColor: "#0A66C2",
    requiredScopes: ["w_member_social", "r_organization_social", "w_organization_social"],
  },
  PINTEREST: {
    name: "Pinterest Business",
    icon: "📌",
    brandColor: "#BD081C",
    requiredScopes: ["boards:read", "pins:read", "pins:write"],
  },
  X: {
    name: "X (Twitter) v2",
    icon: "𝕏",
    brandColor: "#000000",
    requiredScopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
  },
  TELEGRAM: {
    name: "Telegram Bot Channel",
    icon: "✈",
    brandColor: "#229ED9",
    requiredScopes: ["bot_posts", "channel_manage"],
  },
  WHATSAPP: {
    name: "WhatsApp Business Cloud",
    icon: "💬",
    brandColor: "#25D366",
    requiredScopes: ["whatsapp_business_messaging", "whatsapp_business_management"],
  },
};

export function createConnectedAccount(
  brandId: string,
  platform: SocialPlatform,
  accountName: string,
  accountHandle: string,
  rawAccessToken: string,
  rawRefreshToken?: string
): ConnectedAccount {
  return {
    id: `sa_${platform.toLowerCase()}_${Date.now()}`,
    brandId,
    platform,
    accountName,
    accountHandle,
    encryptedAccessToken: encryptToken(rawAccessToken),
    encryptedRefreshToken: rawRefreshToken ? encryptToken(rawRefreshToken) : undefined,
    tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    status: "ACTIVE",
    healthScore: 100,
    lastHealthCheck: new Date().toISOString(),
    followerCount: Math.floor(Math.random() * 25000) + 1200,
    scopes: SUPPORTED_PLATFORMS[platform]?.requiredScopes || [],
    connectedAt: new Date().toISOString(),
  };
}

export function getDecryptedAccessToken(account: ConnectedAccount): string {
  return decryptToken(account.encryptedAccessToken);
}
