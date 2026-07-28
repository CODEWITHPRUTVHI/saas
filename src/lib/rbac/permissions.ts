// ─── Role Definitions ─────────────────────────────────────────────────────────
export const ROLES = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "EDITOR",
  "DESIGNER",
  "SEO_SPECIALIST",
  "PUBLISHER",
  "VIEWER",
] as const;

export type Role = typeof ROLES[number];

// ─── Permission Matrix ────────────────────────────────────────────────────────
// Each permission maps to roles that can perform it
export const PERMISSION_MATRIX: Record<string, Role[]> = {
  // Organization & Workspace Management
  "org:manage":               ["OWNER"],
  "workspace:manage":         ["OWNER", "ADMIN"],
  "workspace:view":           ["OWNER", "ADMIN", "MANAGER", "EDITOR", "DESIGNER", "SEO_SPECIALIST", "PUBLISHER", "VIEWER"],

  // Brand Management
  "brand:create":             ["OWNER", "ADMIN"],
  "brand:delete":             ["OWNER"],
  "brand:edit":               ["OWNER", "ADMIN", "MANAGER"],
  "brand:view":               ["OWNER", "ADMIN", "MANAGER", "EDITOR", "DESIGNER", "SEO_SPECIALIST", "PUBLISHER", "VIEWER"],
  "brand:duplicate":          ["OWNER", "ADMIN"],
  "brand:template:apply":     ["OWNER", "ADMIN"],

  // User & Membership Management
  "user:invite":              ["OWNER", "ADMIN"],
  "user:remove":              ["OWNER", "ADMIN"],
  "user:role:change":         ["OWNER", "ADMIN"],

  // Content Operations
  "content:upload":           ["OWNER", "ADMIN", "MANAGER", "EDITOR", "DESIGNER", "SEO_SPECIALIST", "PUBLISHER"],
  "content:edit":             ["OWNER", "ADMIN", "MANAGER", "EDITOR", "SEO_SPECIALIST"],
  "content:delete":           ["OWNER", "ADMIN", "MANAGER"],
  "content:view":             ["OWNER", "ADMIN", "MANAGER", "EDITOR", "DESIGNER", "SEO_SPECIALIST", "PUBLISHER", "VIEWER"],
  "content:submit":           ["OWNER", "ADMIN", "MANAGER", "EDITOR", "SEO_SPECIALIST", "PUBLISHER"],

  // Approval Workflow
  "approval:editor_review":   ["OWNER", "ADMIN", "MANAGER", "EDITOR"],
  "approval:manager_review":  ["OWNER", "ADMIN", "MANAGER"],
  "approval:owner_approve":   ["OWNER", "ADMIN"],
  "approval:reject":          ["OWNER", "ADMIN", "MANAGER", "EDITOR"],

  // Publishing
  "publish:schedule":         ["OWNER", "ADMIN", "MANAGER", "PUBLISHER"],
  "publish:immediate":        ["OWNER", "ADMIN"],
  "publish:view_queue":       ["OWNER", "ADMIN", "MANAGER", "EDITOR", "PUBLISHER", "VIEWER"],

  // Social Accounts
  "social_account:connect":   ["OWNER", "ADMIN"],
  "social_account:disconnect":["OWNER", "ADMIN"],
  "social_account:view":      ["OWNER", "ADMIN", "MANAGER", "PUBLISHER", "VIEWER"],

  // Cloud Storage
  "storage:connect":          ["OWNER", "ADMIN"],
  "storage:view":             ["OWNER", "ADMIN", "MANAGER", "EDITOR", "PUBLISHER", "VIEWER"],

  // AI Features
  "ai:metadata_gen":          ["OWNER", "ADMIN", "MANAGER", "EDITOR", "SEO_SPECIALIST"],
  "ai:translation":           ["OWNER", "ADMIN", "MANAGER", "EDITOR", "SEO_SPECIALIST"],
  "ai:subtitles":             ["OWNER", "ADMIN", "MANAGER", "EDITOR", "SEO_SPECIALIST"],
  "ai:thumbnail":             ["OWNER", "ADMIN", "MANAGER", "EDITOR", "DESIGNER"],
  "ai:repurpose":             ["OWNER", "ADMIN", "MANAGER", "EDITOR", "DESIGNER"],

  // Brand Kit & DAM
  "brand_kit:edit":           ["OWNER", "ADMIN", "DESIGNER"],
  "brand_kit:view":           ["OWNER", "ADMIN", "MANAGER", "EDITOR", "DESIGNER", "SEO_SPECIALIST", "PUBLISHER", "VIEWER"],
  "dam:tag":                  ["OWNER", "ADMIN", "MANAGER", "EDITOR", "DESIGNER"],
  "dam:delete":               ["OWNER", "ADMIN", "MANAGER"],

  // Analytics & Reports
  "analytics:view":           ["OWNER", "ADMIN", "MANAGER", "VIEWER"],
  "reports:generate":         ["OWNER", "ADMIN", "MANAGER"],
  "reports:schedule":         ["OWNER", "ADMIN"],

  // Bulk Operations
  "bulk:publish":             ["OWNER", "ADMIN"],
  "bulk:schedule":            ["OWNER", "ADMIN", "MANAGER"],
  "bulk:tag":                 ["OWNER", "ADMIN", "MANAGER", "EDITOR"],
  "bulk:delete":              ["OWNER", "ADMIN"],
  "bulk:metadata_update":     ["OWNER", "ADMIN", "MANAGER", "SEO_SPECIALIST"],

  // Approval Workflow Config
  "workflow:configure":       ["OWNER", "ADMIN"],
  "workflow:view":            ["OWNER", "ADMIN", "MANAGER", "EDITOR", "VIEWER"],
};

// ─── Core Permission Check ────────────────────────────────────────────────────
export function canDo(role: Role, permission: string): boolean {
  const allowedRoles = PERMISSION_MATRIX[permission];
  if (!allowedRoles) {
    console.warn(`Unknown permission: "${permission}"`);
    return false;
  }
  return allowedRoles.includes(role);
}

// ─── Role Hierarchy (for UI display) ─────────────────────────────────────────
export const ROLE_HIERARCHY: Record<Role, number> = {
  OWNER:          8,
  ADMIN:          7,
  MANAGER:        6,
  EDITOR:         5,
  SEO_SPECIALIST: 4,
  DESIGNER:       3,
  PUBLISHER:      2,
  VIEWER:         1,
};

export const ROLE_LABELS: Record<Role, { label: string; description: string; color: string }> = {
  OWNER:          { label: "Owner",          description: "Full access. Manages org, billing, all brands.",       color: "text-amber-400 bg-amber-500/15 border-amber-500/30" },
  ADMIN:          { label: "Admin",          description: "Full access except billing. Manages workspace.",        color: "text-red-400 bg-red-500/15 border-red-500/30" },
  MANAGER:        { label: "Manager",        description: "Manages brands, content approval, scheduling.",         color: "text-brand-accent bg-brand-500/15 border-brand-500/30" },
  EDITOR:         { label: "Editor",         description: "Creates and edits content. Submits for review.",       color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30" },
  SEO_SPECIALIST: { label: "SEO Specialist", description: "Manages metadata, tags, translation, subtitles.",      color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
  DESIGNER:       { label: "Designer",       description: "Brand kits, thumbnails, aspect ratio cuts.",           color: "text-pink-400 bg-pink-500/15 border-pink-500/30" },
  PUBLISHER:      { label: "Publisher",      description: "Schedules and publishes approved content only.",       color: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30" },
  VIEWER:         { label: "Viewer",         description: "Read-only. Can view content and analytics.",           color: "text-gray-400 bg-gray-500/15 border-gray-500/30" },
};

// ─── Get All Permissions for a Role ──────────────────────────────────────────
export function getPermissionsForRole(role: Role): string[] {
  return Object.entries(PERMISSION_MATRIX)
    .filter(([, roles]) => roles.includes(role))
    .map(([perm]) => perm);
}
