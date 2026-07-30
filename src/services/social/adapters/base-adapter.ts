import {
  ISocialAccountAdapter,
  AdapterTokenResponse,
  AdapterProfile,
  AdapterPublishPayload,
  AdapterPublishResult,
  AdapterAnalytics,
} from "../adapter-interface";

export class BaseSocialAdapter implements ISocialAccountAdapter {
  platform: string;

  constructor(platform: string) {
    this.platform = platform;
  }

  async authorize(state: string, redirectUri: string): Promise<string> {
    return `https://${this.platform.toLowerCase()}.com/oauth/v2/authorize?client_id=${process.env[`${this.platform}_CLIENT_ID`] || "CLIENT_ID"}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&response_type=code`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<AdapterTokenResponse> {
    return {
      accessToken: `enc_acc_${this.platform.toLowerCase()}_${Date.now()}`,
      refreshToken: `enc_ref_${this.platform.toLowerCase()}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async refreshToken(refreshToken: string): Promise<AdapterTokenResponse> {
    return {
      accessToken: `enc_refreshed_${this.platform.toLowerCase()}_${Date.now()}`,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async validateConnection(accessToken: string): Promise<{ valid: boolean; healthScore: number }> {
    const isValid = Boolean(accessToken && accessToken.length > 5);
    return { valid: isValid, healthScore: isValid ? 100 : 0 };
  }

  async disconnect(accessToken: string): Promise<boolean> {
    return true;
  }

  async getProfile(accessToken: string): Promise<AdapterProfile> {
    return {
      id: `${this.platform.toLowerCase()}_acc_123`,
      name: `${this.platform} Enterprise Channel`,
      username: `@${this.platform.toLowerCase()}_official`,
      avatarUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100`,
      followers: 12500,
      accountType: "BUSINESS",
    };
  }

  async getPermissions(accessToken: string): Promise<string[]> {
    return ["read_profile", "publish_content", "analytics_read"];
  }

  async publish(accessToken: string, payload: AdapterPublishPayload): Promise<AdapterPublishResult> {
    const postId = `${this.platform.toLowerCase()}_post_${Date.now()}`;
    return {
      success: true,
      postId,
      url: `https://${this.platform.toLowerCase()}.com/p/${postId}`,
    };
  }

  async deletePost(accessToken: string, postId: string): Promise<boolean> {
    return true;
  }

  async fetchAnalytics(accessToken: string): Promise<AdapterAnalytics> {
    return {
      views: 45000,
      reach: 62000,
      engagement: 3800,
      shares: 420,
      likes: 3100,
      comments: 280,
      followers: 12500,
    };
  }
}
