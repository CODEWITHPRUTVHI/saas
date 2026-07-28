"use client";

import { useState } from "react";
import { Shield, Users, Check, X, ChevronDown } from "lucide-react";
import { ROLES, ROLE_LABELS, ROLE_HIERARCHY, PERMISSION_MATRIX, canDo, type Role } from "@/lib/rbac/permissions";

const PERMISSION_GROUPS: Record<string, string[]> = {
  "Content Operations":   ["content:upload","content:edit","content:delete","content:view","content:submit"],
  "Approval Workflow":    ["approval:editor_review","approval:manager_review","approval:owner_approve","approval:reject"],
  "Publishing":           ["publish:schedule","publish:immediate","publish:view_queue"],
  "AI Features":          ["ai:metadata_gen","ai:translation","ai:subtitles","ai:thumbnail","ai:repurpose"],
  "Brand Management":     ["brand:create","brand:edit","brand:delete","brand:view","brand:duplicate"],
  "Analytics & Reports":  ["analytics:view","reports:generate","reports:schedule"],
  "Bulk Operations":      ["bulk:publish","bulk:schedule","bulk:tag","bulk:delete","bulk:metadata_update"],
  "Brand Kit & DAM":      ["brand_kit:edit","brand_kit:view","dam:tag","dam:delete"],
  "Platform Connections": ["social_account:connect","social_account:view","storage:connect","storage:view"],
};

export default function BrandKitsPage() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>("Content Operations");
  const [hoveredRole, setHoveredRole] = useState<Role | null>(null);

  const sortedRoles = [...ROLES].sort((a, b) => ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a]);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Shield className="h-6 w-6" style={{ color: '#7091E6' }} />
          RBAC Permission Matrix — 8 Roles
        </h1>
        <p className="page-subtitle">
          Enterprise role-based access control. Click a role to highlight all permissions it grants.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {sortedRoles.map((role) => {
          const conf = ROLE_LABELS[role];
          const isHovered = hoveredRole === role;
          return (
            <button
              key={role}
              onMouseEnter={() => setHoveredRole(role)}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => setHoveredRole(hoveredRole === role ? null : role)}
              className="p-3.5 rounded-xl border text-left transition-all duration-150"
              style={{
                borderColor: isHovered ? '#3D52A0' : '#ADBBDA',
                background: isHovered ? 'rgba(61,82,160,.08)' : '#FFFFFF',
              }}
            >
              <div className="px-2 py-0.5 rounded text-[10px] font-bold mb-2 w-fit"
                style={{ background: 'rgba(112,145,230,.12)', color: '#3D52A0', border: '1px solid rgba(112,145,230,.30)' }}>
                {conf.label}
              </div>
              <p className="text-[10px] leading-snug line-clamp-2" style={{ color: '#8697C4' }}>{conf.description}</p>
            </button>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <div className="card overflow-hidden">
        <div className="p-5" style={{ borderBottom: '1px solid #ADBBDA' }}>
          <h2 className="font-bold text-base" style={{ color: '#3D52A0' }}>Permission Grant Matrix</h2>
          <p className="text-xs mt-1" style={{ color: '#8697C4' }}>✅ Allowed &nbsp;&nbsp; — Not granted</p>
        </div>

        {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => (
          <div key={group}>
            <button
              onClick={() => setExpandedGroup(expandedGroup === group ? null : group)}
              className="w-full flex items-center justify-between px-5 py-3 transition text-left"
              style={{ borderBottom: '1px solid #EDE8F5' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#EDE8F5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#3D52A0' }}>{group}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#8697C4' }}>{permissions.length} permissions</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expandedGroup === group ? "rotate-180" : ""}`} style={{ color: '#8697C4' }} />
              </div>
            </button>

            {expandedGroup === group && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[700px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ADBBDA', background: '#EDE8F5' }}>
                      <th className="text-left px-5 py-2.5 font-semibold w-56" style={{ color: '#8697C4' }}>Permission</th>
                      {sortedRoles.map((role) => (
                        <th key={role} className="text-center py-2.5 px-2 font-semibold w-20" style={{ color: hoveredRole === role ? '#3D52A0' : '#8697C4' }}>
                          {ROLE_LABELS[role].label.split(" ")[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm, i) => (
                      <tr key={perm} className="transition" style={{ borderBottom: '1px solid #EDE8F5' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#EDE8F5')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td className="px-5 py-2 font-mono" style={{ color: '#3D52A0' }}>{perm}</td>
                        {sortedRoles.map((role) => {
                          const granted = canDo(role, perm);
                          return (
                            <td key={role} className="text-center py-2 px-2">
                              {granted ? (
                                <Check className="h-4 w-4 mx-auto" style={{ color: '#22c55e' }} />
                              ) : (
                                <span className="text-base leading-none" style={{ color: '#ADBBDA' }}>—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
