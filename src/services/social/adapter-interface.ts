// ── Common Social Account Adapter Interface ────────────────────────────────────

export interface AdapterTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface AdapterProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  followers?: number;
  accountType?: "BUSINESS" | "CREATOR" | "PERSONAL";
}

export interface AdapterPublishPayload {
  title?: string;
  caption?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  scheduledAt?: string;
}

export interface AdapterPublishResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
  retryable?: boolean;
}

export interface AdapterAnalytics {
  views: number;
  reach: number;
  engagement: number;
  shares: number;
  likes: number;
  comments: number;
  followers: number;
}

export interface ISocialAccountAdapter {
  platform: string;

  /**
   * Returns official OAuth authorization URL for provider redirect
   */
  authorize(state: string, redirectUri: string): Promise<string>;

  /**
   * Exchanges OAuth authorization code for Access & Refresh tokens
   */
  exchangeCode(code: string, redirectUri: string): Promise<AdapterTokenResponse>;

  /**
   * Refreshes expired access token using encrypted refresh token
   */
  refreshToken(refreshToken: string): Promise<AdapterTokenResponse>;

  /**
   * Health check to validate API connection status
   */
  validateConnection(accessToken: string): Promise<{ valid: boolean; healthScore: number }>;

  /**
   * Revoke OAuth token and disconnect account
   */
  disconnect(accessToken: string): Promise<boolean>;

  /**
   * Fetch connected user/channel profile details
   */
  getProfile(accessToken: string): Promise<AdapterProfile>;

  /**
   * Fetch active OAuth scopes and granted permissions
   */
  getPermissions(accessToken: string): Promise<string[]>;

  /**
   * Publish media/text post to platform API
   */
  publish(accessToken: string, payload: AdapterPublishPayload): Promise<AdapterPublishResult>;

  /**
   * Delete post from platform
   */
  deletePost(accessToken: string, postId: string): Promise<boolean>;

  /**
   * Fetch normalized analytics from official platform API
   */
  fetchAnalytics(accessToken: string): Promise<AdapterAnalytics>;
}
