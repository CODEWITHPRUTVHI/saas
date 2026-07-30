import { canDo, Role } from "@/lib/rbac/permissions";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  industry: string;
  timezone: string;
  country: string;
  subscriptionPlan: "starter" | "pro" | "enterprise";
  storageUsageBytes: number;
  aiCreditsRemaining: number;
  createdDate: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  status: "ACTIVE" | "SUSPENDED" | "PENDING_INVITE";
  joinedAt: string;
  lastLoginAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  details: string;
  timestamp: string;
}

export class WorkspaceService {
  /**
   * Fetch all workspaces for user
   */
  static getUserWorkspaces(userId: string): Workspace[] {
    return [
      {
        id: "ws_pruthviraj",
        name: "Pruthviraj Workspace",
        slug: "pruthviraj-workspace",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
        industry: "Media & AI OS",
        timezone: "America/New_York",
        country: "United States",
        subscriptionPlan: "enterprise",
        storageUsageBytes: 1024 * 1024 * 1024 * 4.2, // 4.2 GB
        aiCreditsRemaining: 50000,
        createdDate: "2026-01-01",
      },
      {
        id: "ws_horizon_7",
        name: "7 Horizon Media",
        slug: "7-horizon-media",
        logoUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?w=100",
        industry: "Digital Publishing Agency",
        timezone: "Europe/London",
        country: "United Kingdom",
        subscriptionPlan: "pro",
        storageUsageBytes: 1024 * 1024 * 1024 * 1.8,
        aiCreditsRemaining: 15000,
        createdDate: "2026-02-15",
      },
    ];
  }

  /**
   * Fetch workspace team members
   */
  static getWorkspaceMembers(workspaceId: string): WorkspaceMember[] {
    return [
      {
        id: "wm_1",
        userId: "u1",
        name: "Pruthviraj Chavan",
        email: "pruthvirajchavan973@gmail.com",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        role: "OWNER",
        status: "ACTIVE",
        joinedAt: "2026-01-01",
        lastLoginAt: "Just now",
      },
      {
        id: "wm_2",
        userId: "u2",
        name: "Sarah Admin",
        email: "sarah.admin@enterprise.io",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        role: "ADMIN",
        status: "ACTIVE",
        joinedAt: "2026-02-01",
        lastLoginAt: "10 mins ago",
      },
      {
        id: "wm_3",
        userId: "u3",
        name: "Marcus Manager",
        email: "marcus.m@enterprise.io",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        role: "MANAGER",
        status: "ACTIVE",
        joinedAt: "2026-03-10",
        lastLoginAt: "1 hour ago",
      },
      {
        id: "wm_4",
        userId: "u4",
        name: "Elena Editor",
        email: "elena.e@enterprise.io",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        role: "EDITOR",
        status: "ACTIVE",
        joinedAt: "2026-04-05",
        lastLoginAt: "Yesterday",
      },
      {
        id: "wm_5",
        userId: "u5",
        name: "Vic Viewer",
        email: "vic.v@enterprise.io",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        role: "VIEWER",
        status: "ACTIVE",
        joinedAt: "2026-05-12",
        lastLoginAt: "3 days ago",
      },
    ];
  }

  /**
   * Invite new team member
   */
  static inviteMember(workspaceId: string, email: string, role: Role, currentRole: Role): Invitation {
    if (!canDo(currentRole, "user:invite")) {
      throw new Error("Permission denied: You cannot invite users.");
    }

    return {
      id: `inv_${Date.now()}`,
      email,
      role,
      invitedBy: "Pruthviraj Chavan",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PENDING",
    };
  }

  /**
   * Fetch audit logs for workspace
   */
  static getAuditLogs(workspaceId: string): AuditLogItem[] {
    return [
      { id: "al_1", userId: "u1", userName: "Pruthviraj Chavan", action: "Connected YouTube Channel", entityType: "SocialAccount", details: "Connected @HyperGrowthAI", timestamp: "2026-07-29 16:30" },
      { id: "al_2", userId: "u2", userName: "Sarah Admin", action: "Updated Brand Settings", entityType: "Brand", details: "Updated voice profile for Nike", timestamp: "2026-07-29 14:15" },
      { id: "al_3", userId: "u1", userName: "Pruthviraj Chavan", action: "Invited Team Member", entityType: "WorkspaceMember", details: "Invited elena.e@enterprise.io as EDITOR", timestamp: "2026-07-28 11:00" },
    ];
  }
}
