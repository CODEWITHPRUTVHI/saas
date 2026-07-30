// ── Workspace & Brand Hierarchy Manager ───────────────────────────────────────
// Hierarchy: Workspace -> Brands -> Social Accounts

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "EDITOR" | "VIEWER";
  avatarUrl?: string;
  joinedAt: string;
}

export interface BrandSettings {
  id: string;
  workspaceId: string;
  name: string;
  logoUrl?: string;
  website?: string;
  primaryColor: string;
  secondaryColor: string;
  timezone: string;
  brandVoiceProfile: string;
  defaultHashtags: string;
  defaultPublishingSettings: {
    autoApprove: boolean;
    watermarkEnabled: boolean;
    defaultPlatforms: string[];
    scheduleDelayMinutes: number;
  };
  createdAt: string;
}

export interface WorkspaceData {
  id: string;
  name: string;
  slug: string;
  members: WorkspaceMember[];
  brands: BrandSettings[];
  createdAt: string;
}

const DEFAULT_WORKSPACE: WorkspaceData = {
  id: "ws_acme_enterprise",
  name: "Acme Enterprise OS",
  slug: "acme-enterprise",
  members: [
    { id: "u1", name: "Alex Admin", email: "admin@drox.io", role: "OWNER", joinedAt: "2026-01-01" },
    { id: "u2", name: "Sarah Manager", email: "sarah@drox.io", role: "MANAGER", joinedAt: "2026-02-15" },
    { id: "u3", name: "Elena Editor", email: "elena@drox.io", role: "EDITOR", joinedAt: "2026-03-01" },
    { id: "u4", name: "Vic Viewer", email: "vic@drox.io", role: "VIEWER", joinedAt: "2026-04-10" },
  ],
  brands: [
    {
      id: "b1",
      workspaceId: "ws_acme_enterprise",
      name: "HyperGrowth Tech AI",
      website: "https://hypergrowth.ai",
      primaryColor: "#3D52A0",
      secondaryColor: "#7091E6",
      timezone: "America/New_York",
      brandVoiceProfile: "Futuristic, authoritative, concise.",
      defaultHashtags: "#AI #Automation #SaaS #Growth",
      defaultPublishingSettings: {
        autoApprove: false,
        watermarkEnabled: true,
        defaultPlatforms: ["YOUTUBE", "INSTAGRAM", "TIKTOK", "LINKEDIN"],
        scheduleDelayMinutes: 30,
      },
      createdAt: "2026-01-10",
    },
    {
      id: "b2",
      workspaceId: "ws_acme_enterprise",
      name: "Aura Modern Living",
      website: "https://auraliving.design",
      primaryColor: "#7091E6",
      secondaryColor: "#8697C4",
      timezone: "Europe/London",
      brandVoiceProfile: "Minimalist, elegant, lifestyle focused.",
      defaultHashtags: "#Design #ModernLiving #Architecture",
      defaultPublishingSettings: {
        autoApprove: true,
        watermarkEnabled: false,
        defaultPlatforms: ["INSTAGRAM", "PINTEREST"],
        scheduleDelayMinutes: 60,
      },
      createdAt: "2026-02-01",
    },
  ],
  createdAt: "2026-01-01",
};

export function getWorkspace(id: string = "ws_acme_enterprise"): WorkspaceData {
  return DEFAULT_WORKSPACE;
}

export function getBrandById(brandId: string): BrandSettings | undefined {
  return DEFAULT_WORKSPACE.brands.find((b) => b.id === brandId || b.name === brandId);
}
