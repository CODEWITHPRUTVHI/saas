export interface Brand {
  id: string;
  workspaceId: string;
  name: string;
  logoUrl?: string;
  website?: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  defaultLanguage: string;
  timezone: string;
  defaultAiTone: string;
  defaultHashtags: string[];
  publishingPreferences: {
    autoApprove: boolean;
    watermarkEnabled: boolean;
    scheduleDelayMinutes: number;
  };
  connectedAccountIds: string[];
  postsCount: number;
  followersCount: number;
  createdAt: string;
}

export class BrandService {
  /**
   * Fetch all brands for a workspace
   */
  static getWorkspaceBrands(workspaceId: string): Brand[] {
    return [
      {
        id: "b_nike",
        workspaceId,
        name: "Nike",
        logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100",
        website: "https://nike.com",
        description: "Athletic footwear and apparel global brand.",
        primaryColor: "#000000",
        secondaryColor: "#3D52A0",
        accentColor: "#7091E6",
        defaultLanguage: "en",
        timezone: "America/New_York",
        defaultAiTone: "Energetic, inspirational, athletic",
        defaultHashtags: ["#JustDoIt", "#Nike", "#Athletics", "#Growth"],
        publishingPreferences: {
          autoApprove: false,
          watermarkEnabled: true,
          scheduleDelayMinutes: 30,
        },
        connectedAccountIds: ["sa_yt_1", "sa_ig_1"],
        postsCount: 1420,
        followersCount: 1240000,
        createdAt: "2026-01-10",
      },
      {
        id: "b_apple",
        workspaceId,
        name: "Apple",
        logoUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100",
        website: "https://apple.com",
        description: "Innovative consumer electronics and digital services.",
        primaryColor: "#1D1D1F",
        secondaryColor: "#8697C4",
        accentColor: "#7091E6",
        defaultLanguage: "en",
        timezone: "America/Los_Angeles",
        defaultAiTone: "Minimalist, elegant, premium, groundbreaking",
        defaultHashtags: ["#ShotOniPhone", "#Apple", "#Innovation"],
        publishingPreferences: {
          autoApprove: true,
          watermarkEnabled: false,
          scheduleDelayMinutes: 60,
        },
        connectedAccountIds: ["sa_yt_2", "sa_li_1"],
        postsCount: 890,
        followersCount: 3200000,
        createdAt: "2026-02-01",
      },
      {
        id: "b_samsung",
        workspaceId,
        name: "Samsung",
        logoUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100",
        website: "https://samsung.com",
        description: "Next-generation mobile technology and displays.",
        primaryColor: "#1428A0",
        secondaryColor: "#3D52A0",
        accentColor: "#7091E6",
        defaultLanguage: "en",
        timezone: "Asia/Seoul",
        defaultAiTone: "Futuristic, technological, bold",
        defaultHashtags: ["#GalaxyAI", "#Samsung", "#Tech"],
        publishingPreferences: {
          autoApprove: false,
          watermarkEnabled: true,
          scheduleDelayMinutes: 15,
        },
        connectedAccountIds: ["sa_tt_1", "sa_x_1"],
        postsCount: 650,
        followersCount: 980000,
        createdAt: "2026-03-15",
      },
    ];
  }
}
