/**
 * Real OAuth 2.0 Core Library
 * Supports Google/YouTube, Meta/Instagram, TikTok, LinkedIn, and Twitter/X
 */

export interface OAuthConfig {
  platform: string;
  name: string;
  authUrl: string;
  tokenUrl: string;
  profileUrl: string;
  clientIdEnvVar: string;
  clientSecretEnvVar: string;
  scopes: string[];
}

export const OAUTH_PROVIDERS: Record<string, OAuthConfig> = {
  YOUTUBE: {
    platform: "YOUTUBE",
    name: "YouTube",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    profileUrl: "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
    clientIdEnvVar: "YOUTUBE_CLIENT_ID",
    clientSecretEnvVar: "YOUTUBE_CLIENT_SECRET",
    scopes: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  },
  INSTAGRAM: {
    platform: "INSTAGRAM",
    name: "Instagram",
    authUrl: "https://api.instagram.com/oauth/authorize",
    tokenUrl: "https://api.instagram.com/oauth/access_token",
    profileUrl: "https://graph.instagram.com/me?fields=id,username,account_type,media_count",
    clientIdEnvVar: "INSTAGRAM_CLIENT_ID",
    clientSecretEnvVar: "INSTAGRAM_CLIENT_SECRET",
    scopes: ["instagram_basic", "instagram_content_publish"],
  },
  TIKTOK: {
    platform: "TIKTOK",
    name: "TikTok",
    authUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    profileUrl: "https://open.tiktokapis.com/v2/user/info/",
    clientIdEnvVar: "TIKTOK_CLIENT_KEY",
    clientSecretEnvVar: "TIKTOK_CLIENT_SECRET",
    scopes: ["user.info.basic", "video.upload"],
  },
  LINKEDIN: {
    platform: "LINKEDIN",
    name: "LinkedIn",
    authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    profileUrl: "https://api.linkedin.com/v2/me",
    clientIdEnvVar: "LINKEDIN_CLIENT_ID",
    clientSecretEnvVar: "LINKEDIN_CLIENT_SECRET",
    scopes: ["r_liteprofile", "w_member_social"],
  },
  TWITTER: {
    platform: "TWITTER",
    name: "Twitter / X",
    authUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.twitter.com/2/oauth2/token",
    profileUrl: "https://api.twitter.com/2/users/me",
    clientIdEnvVar: "TWITTER_CLIENT_ID",
    clientSecretEnvVar: "TWITTER_CLIENT_SECRET",
    scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
  },
};

/**
 * Checks if real credentials exist in process.env for a platform
 */
export function isPlatformConfigured(platform: string): boolean {
  const config = OAUTH_PROVIDERS[platform.toUpperCase()];
  if (!config) return false;
  const clientId = process.env[config.clientIdEnvVar];
  const clientSecret = process.env[config.clientSecretEnvVar];
  return Boolean(clientId && clientId.trim() !== "" && clientSecret && clientSecret.trim() !== "");
}

/**
 * Gets the redirect URL for OAuth callbacks
 */
export function getRedirectUri(platform: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/api/auth/callback/${platform.toLowerCase()}`;
}

/**
 * Builds the authorization URL to redirect the user to
 */
export function buildAuthorizationUrl(platform: string, state: string = "default"): string {
  const config = OAUTH_PROVIDERS[platform.toUpperCase()];
  if (!config) throw new Error(`Unsupported platform: ${platform}`);

  const clientId = process.env[config.clientIdEnvVar] || "";
  const redirectUri = getRedirectUri(platform);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: config.scopes.join(" "),
    state,
    access_type: "offline",
    prompt: "consent",
  });

  if (platform.toUpperCase() === "TIKTOK") {
    params.set("client_key", clientId);
  }

  return `${config.authUrl}?${params.toString()}`;
}

/**
 * Exchanges authorization code for access tokens
 */
export async function exchangeCodeForTokens(platform: string, code: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}> {
  const config = OAUTH_PROVIDERS[platform.toUpperCase()];
  if (!config) throw new Error(`Unsupported platform: ${platform}`);

  const clientId = process.env[config.clientIdEnvVar] || "";
  const clientSecret = process.env[config.clientSecretEnvVar] || "";
  const redirectUri = getRedirectUri(platform);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Fetches user profile using the access token
 */
export async function fetchOAuthUserProfile(platform: string, accessToken: string): Promise<{
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  followersCount?: string;
}> {
  const config = OAUTH_PROVIDERS[platform.toUpperCase()];
  if (!config) throw new Error(`Unsupported platform: ${platform}`);

  try {
    const response = await fetch(config.profileUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const data = await response.json();

      if (platform.toUpperCase() === "YOUTUBE" && data.items?.[0]) {
        const channel = data.items[0];
        return {
          id: channel.id,
          name: channel.snippet?.title || "YouTube Channel",
          handle: channel.snippet?.customUrl || `@channel_${channel.id.slice(0, 6)}`,
          avatarUrl: channel.snippet?.thumbnails?.default?.url,
          followersCount: channel.statistics?.subscriberCount ? `${Math.round(channel.statistics.subscriberCount / 1000)}K` : "0",
        };
      }

      if (platform.toUpperCase() === "INSTAGRAM") {
        return {
          id: data.id || `ig_${Date.now()}`,
          name: data.username || "Instagram Account",
          handle: `@${data.username || "ig_user"}`,
          followersCount: "0",
        };
      }

      if (data.data) {
        return {
          id: data.data.id,
          name: data.data.name || data.data.username,
          handle: `@${data.data.username || data.data.name}`,
        };
      }
    }
  } catch (e) {
    console.warn("Failed to fetch profile from provider API:", e);
  }

  // Safe fallback profile
  return {
    id: `${platform.toLowerCase()}_${Date.now()}`,
    name: `${config.name} Account`,
    handle: `@${platform.toLowerCase()}_user`,
    followersCount: "0",
  };
}
