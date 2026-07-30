"use client";

import { useState } from "react";
import {
  Settings, Users, Building2, Share2, Shield, Key, FileText,
  Trash2, Plus, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink,
  Smartphone, Lock, Eye, EyeOff, Globe, Sparkles, Mail, UserCheck
} from "lucide-react";
import { WorkspaceService, WorkspaceMember } from "@/services/workspace/workspace-service";
import { BrandService } from "@/services/brand/brand-service";
import { AuthService } from "@/services/auth/auth-service";
import { ROLE_LABELS, Role } from "@/lib/rbac/permissions";

const TABS = [
  { id: "general",   label: "General",            icon: Settings },
  { id: "workspace", label: "Workspace",          icon: Building2 },
  { id: "members",   label: "Members & Team",     icon: Users },
  { id: "brands",    label: "Brands",             icon: Building2 },
  { id: "accounts",  label: "Connected Accounts", icon: Share2 },
  { id: "security",  label: "Security & Sessions",icon: Shield },
  { id: "api-keys",  label: "API Keys & Webhooks",icon: Key },
  { id: "logs",      label: "Audit Logs",         icon: FileText },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  // State for Workspace & Team
  const [members, setMembers] = useState<WorkspaceMember[]>(WorkspaceService.getWorkspaceMembers("ws_pruthviraj"));
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("EDITOR");

  // State for Brands
  const brands = BrandService.getWorkspaceBrands("ws_pruthviraj");

  // State for Security
  const sessions = AuthService.getActiveDeviceSessions("u1");

  // Notifications
  const [message, setMessage] = useState<string | null>(null);

  function handleInvite() {
    if (!inviteEmail) return;
    const newMember: WorkspaceMember = {
      id: `wm_${Date.now()}`,
      userId: `u_${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "PENDING_INVITE",
      joinedAt: "Just now",
      lastLoginAt: "Never",
    };
    setMembers([newMember, ...members]);
    setShowInviteModal(false);
    setInviteEmail("");
    setMessage(`✓ Invitation sent to ${inviteEmail} as ${inviteRole}`);
    setTimeout(() => setMessage(null), 4000);
  }

  function handleRoleChange(memberId: string, newRole: Role) {
    setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    setMessage(`✓ Role updated successfully`);
    setTimeout(() => setMessage(null), 3000);
  }

  function handleSuspend(memberId: string) {
    setMembers(members.map(m => m.id === memberId ? { ...m, status: m.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : m));
  }

  return (
    <div className="max-w-[1200px] mx-auto animate-in space-y-6">

      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Settings className="h-6 w-6 text-[#7091E6]" />
          Enterprise Settings & Governance
        </h1>
        <p className="page-subtitle">Configure organization workspace, multi-brand credentials, team RBAC, and connected APIs</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-sm font-bold flex items-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      {/* Main Settings Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Left Settings Sidebar (3 Cols) */}
        <div className="md:col-span-3 space-y-1">
          <div className="card p-2 bg-white border border-[#ADBBDA]">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all text-left ${
                    isActive
                      ? "bg-[#3D52A0] text-white shadow-sm"
                      : "text-[#8697C4] hover:bg-[#EDE8F5] hover:text-[#3D52A0]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Settings Content Area (9 Cols) */}
        <div className="md:col-span-9 space-y-6">

          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="card p-6 bg-white border border-[#ADBBDA] space-y-6 animate-in">
              <h2 className="text-base font-extrabold text-[#3D52A0] pb-3 border-b border-[#ADBBDA]">General Settings</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-[#8697C4]">Workspace Name</label>
                  <input defaultValue="Pruthviraj Workspace" className="input text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-[#8697C4]">Workspace Slug</label>
                  <input defaultValue="pruthviraj-workspace" className="input text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-[#8697C4]">Industry</label>
                  <input defaultValue="Media & AI OS" className="input text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-[#8697C4]">Default Timezone</label>
                  <select defaultValue="America/New_York" className="input text-xs">
                    <option value="America/New_York">America/New_York (UTC-5)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#ADBBDA] flex justify-end">
                <button className="btn-primary text-xs">Save Changes</button>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBERS & TEAM */}
          {activeTab === "members" && (
            <div className="card p-6 bg-white border border-[#ADBBDA] space-y-6 animate-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#ADBBDA]">
                <div>
                  <h2 className="text-base font-extrabold text-[#3D52A0]">Team Members & Access Control</h2>
                  <p className="text-xs text-[#8697C4] mt-0.5">Manage team invitations and role permissions</p>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="btn-primary text-xs flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Invite Member
                </button>
              </div>

              {/* Members List */}
              <div className="divide-y divide-[#ADBBDA]/60">
                {members.map((m) => (
                  <div key={m.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#3D52A0] text-white flex items-center justify-center font-bold text-xs">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#3D52A0]">{m.name}</span>
                          {m.status === "SUSPENDED" && (
                            <span className="badge badge-error text-[9px]">SUSPENDED</span>
                          )}
                          {m.status === "PENDING_INVITE" && (
                            <span className="badge badge-warning text-[9px]">PENDING</span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8697C4]">{m.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Role Selector */}
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value as Role)}
                        disabled={m.role === "OWNER"}
                        className="px-2.5 py-1 rounded-lg border border-[#ADBBDA] bg-[#EDE8F5] text-xs font-bold text-[#3D52A0]"
                      >
                        {(["OWNER", "ADMIN", "MANAGER", "EDITOR", "VIEWER"] as const).map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>

                      {m.role !== "OWNER" && (
                        <button
                          onClick={() => handleSuspend(m.id)}
                          className="px-2 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50"
                        >
                          {m.status === "SUSPENDED" ? "Unsuspend" : "Suspend"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BRANDS */}
          {activeTab === "brands" && (
            <div className="card p-6 bg-white border border-[#ADBBDA] space-y-6 animate-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#ADBBDA]">
                <div>
                  <h2 className="text-base font-extrabold text-[#3D52A0]">Workspace Brands ({brands.length})</h2>
                  <p className="text-xs text-[#8697C4] mt-0.5">Multi-brand configuration, colors, voice, and hashtags</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brands.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl border border-[#ADBBDA] bg-[#EDE8F5]/30 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#3D52A0] text-white font-bold flex items-center justify-center text-sm">
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#3D52A0]">{b.name}</h3>
                        <a href={b.website} target="_blank" className="text-xs text-[#7091E6] hover:underline">{b.website}</a>
                      </div>
                    </div>
                    <p className="text-xs text-[#8697C4] leading-relaxed">{b.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {b.defaultHashtags.map((h, i) => (
                        <span key={i} className="text-[10px] font-bold text-[#3D52A0] bg-white px-2 py-0.5 rounded border border-[#ADBBDA]">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & SESSIONS */}
          {activeTab === "security" && (
            <div className="card p-6 bg-white border border-[#ADBBDA] space-y-6 animate-in">
              <h2 className="text-base font-extrabold text-[#3D52A0] pb-3 border-b border-[#ADBBDA]">Active Device Sessions</h2>

              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl border border-[#ADBBDA] bg-[#EDE8F5]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-[#7091E6]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#3D52A0]">{s.deviceName}</span>
                          {s.isCurrent && <span className="badge badge-success text-[9px]">THIS DEVICE</span>}
                        </div>
                        <p className="text-[11px] text-[#8697C4]">{s.browser} · {s.ipAddress} · {s.location}</p>
                      </div>
                    </div>
                    {!s.isCurrent && (
                      <button className="text-xs font-bold text-rose-600 hover:underline">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-[#ADBBDA] shadow-2xl space-y-4">
            <h2 className="text-lg font-extrabold text-[#3D52A0]">Invite Team Member</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase text-[#8697C4]">Email Address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="input text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase text-[#8697C4]">Assign Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
                className="input text-xs"
              >
                {(["ADMIN", "MANAGER", "EDITOR", "VIEWER"] as const).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowInviteModal(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleInvite} className="btn-primary text-xs">Send Invitation</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
