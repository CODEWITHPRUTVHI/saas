// ── DROX Auth ─────────────────────────────────────────────────────────────────
// Lightweight localStorage-based auth for SaaS demo / MVP.
// Swap this out for NextAuth / Supabase Auth in production.

export interface DROXUser {
  id: string;
  name: string;
  email: string;
  plan: "starter" | "pro" | "enterprise";
  brandName: string;
  avatarInitials: string;
  createdAt: string;
}

const SESSION_KEY = "drox_session";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

export function login(email: string, password: string, name?: string, brandName?: string): DROXUser {
  // In production: call your API here.
  // For demo: any non-empty email + 6+ char password is accepted.
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
    plan: "pro",
    brandName: brandName || "My Brand",
    avatarInitials: initials || "U",
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
