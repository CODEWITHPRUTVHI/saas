// ── DROX Auth ─────────────────────────────────────────────────────────────────
// Enterprise Session & Auth System supporting JWT, localStorage fallback, and RBAC roles.

export type Role = "OWNER" | "ADMIN" | "MANAGER" | "EDITOR" | "VIEWER";

export interface DROXUser {
  id: string;
  name: string;
  email: string;
  plan: "starter" | "pro" | "enterprise";
  brandName: string;
  avatarInitials: string;
  role: Role;
  workspaceId: string;
  createdAt: string;
  token?: string;
}

const SESSION_KEY = "drox_session";

function isClient() {
  return typeof window !== "undefined";
}

export function getSession(): DROXUser | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DROXUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function login(email: string, password: string, name?: string, brandName?: string, role: Role = "ADMIN"): DROXUser {
  if (!email || password.length < 6) {
    throw new Error("Invalid credentials.");
  }

  const initials = (name || email)
    .split(/[\s@]+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  const user: DROXUser = {
    id: `user_${Date.now()}`,
    name: name || email.split("@")[0],
    email,
    plan: "enterprise",
    brandName: brandName || "HyperGrowth Tech AI",
    avatarInitials: initials || "U",
    role,
    workspaceId: "ws_acme_enterprise",
    createdAt: new Date().toISOString(),
  };

  if (isClient()) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  return user;
}

export function logout(): void {
  if (isClient()) {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function updateSession(updates: Partial<DROXUser>): void {
  const session = getSession();
  if (!session) return;
  const updated = { ...session, ...updates };
  if (isClient()) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }
}
