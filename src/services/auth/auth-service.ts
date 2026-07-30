import { signJWT, verifyJWT, JWTPayload } from "@/lib/auth/jwt";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phoneNumber?: string;
  timezone: string;
  language: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "EDITOR" | "VIEWER";
  status: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  twoFactorEnabled: boolean;
  notificationPreferences: {
    emailAlerts: boolean;
    publishSuccess: boolean;
    publishFailure: boolean;
    tokenExpiry: boolean;
  };
  securitySettings: {
    lastPasswordChange: string;
    activeSessionsCount: number;
  };
  recentActivity: {
    action: string;
    timestamp: string;
    device: string;
  }[];
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
}

export class AuthService {
  /**
   * Issue access token + refresh token
   */
  static async createTokens(payload: JWTPayload): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await signJWT({ ...payload });
    const refreshToken = await signJWT({ ...payload });
    return { accessToken, refreshToken };
  }

  /**
   * Get user profile details
   */
  static getUserProfile(userId: string): UserProfile {
    return {
      id: userId || "usr_enterprise_01",
      name: "Pruthviraj Chavan",
      email: "pruthvirajchavan973@gmail.com",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      phoneNumber: "+1 (555) 234-5678",
      timezone: "America/New_York",
      language: "en",
      role: "OWNER",
      status: "ACTIVE",
      twoFactorEnabled: false,
      notificationPreferences: {
        emailAlerts: true,
        publishSuccess: true,
        publishFailure: true,
        tokenExpiry: true,
      },
      securitySettings: {
        lastPasswordChange: "2026-06-15",
        activeSessionsCount: 2,
      },
      recentActivity: [
        { action: "Logged in via Google OAuth", timestamp: "2026-07-29 16:30", device: "Chrome on macOS" },
        { action: "Connected YouTube Channel", timestamp: "2026-07-29 15:45", device: "Chrome on macOS" },
      ],
    };
  }

  /**
   * Fetch active device sessions
   */
  static getActiveDeviceSessions(userId: string): DeviceSession[] {
    return [
      {
        id: "sess_current",
        deviceName: "MacBook Pro 16-inch",
        browser: "Google Chrome 126.0",
        ipAddress: "192.168.1.100",
        location: "New York, USA",
        isCurrent: true,
        lastActive: "Just now",
      },
      {
        id: "sess_mobile",
        deviceName: "iPhone 15 Pro",
        browser: "Safari iOS",
        ipAddress: "172.56.21.9",
        location: "New York, USA",
        isCurrent: false,
        lastActive: "2 hours ago",
      },
    ];
  }

  /**
   * Terminate device session
   */
  static revokeDeviceSession(sessionId: string): boolean {
    return true;
  }
}
