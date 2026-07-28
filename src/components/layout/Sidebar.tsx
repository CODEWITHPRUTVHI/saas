"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, FolderSync, Share2, FolderKanban, Cpu, Zap,
  Languages, Scissors, RotateCcw, Building2, CheckCircle2, BarChart3, FileText,
  Shield, ChevronRight,
} from "lucide-react";

const phase1 = [
  { name: "Dashboard",       href: "/dashboard",            icon: LayoutDashboard },
  { name: "Smart Queue",     href: "/dashboard/queue",      icon: CalendarDays },
  { name: "Folder Watchers", href: "/dashboard/watchers",   icon: FolderSync },
  { name: "Social Accounts", href: "/dashboard/accounts",   icon: Share2 },
  { name: "Asset Library",   href: "/dashboard/assets",     icon: FolderKanban },
  { name: "AI Jobs",         href: "/dashboard/ai-jobs",    icon: Cpu },
];

const phase2 = [
  { name: "Subtitle Studio", href: "/dashboard/subtitles",  icon: Languages },
  { name: "Repurposer",      href: "/dashboard/repurposer", icon: Scissors },
  { name: "Evergreen",       href: "/dashboard/recycling",  icon: RotateCcw },
];

const phase3 = [
  { name: "Brands",          href: "/dashboard/brands",     icon: Building2 },
  { name: "Approvals",       href: "/dashboard/approvals",  icon: CheckCircle2 },
  { name: "Analytics",       href: "/dashboard/analytics",  icon: BarChart3 },
  { name: "Reports",         href: "/dashboard/reports",    icon: FileText },
  { name: "Permissions",     href: "/dashboard/brand-kits", icon: Shield },
];

function NavItem({ href, icon: Icon, name }: { href: string; icon: any; name: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`nav-item ${isActive ? "active" : ""}`}>
      <Icon className="h-[17px] w-[17px] shrink-0" />
      <span>{name}</span>
      {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />}
    </Link>
  );
}

function NavSection({ label, badge, items }: { label: string; badge?: string; items: typeof phase1 }) {
  return (
    <div className="px-3">
      <div className="nav-section-label flex items-center gap-1.5">
        {label}
        {badge && (
          <span
            className="px-1.5 py-0.5 rounded text-[9px] font-bold"
            style={{ background: "rgba(173,187,218,.25)", color: "#EDE8F5" }}
          >
            {badge}
          </span>
        )}
      </div>
      {items.map((item) => <NavItem key={item.href} {...item} />)}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar z-40">
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(173,187,218,.20)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)" }}
          >
            <Zap className="h-5 w-5" style={{ color: "#EDE8F5" }} />
          </div>
          <div>
            <p className="font-black text-[15px] tracking-tight leading-none" style={{ color: "#EDE8F5" }}>DROX</p>
            <p className="text-[10px] font-medium tracking-wide mt-0.5" style={{ color: "rgba(237,232,245,.50)" }}>Content OS</p>
          </div>
        </div>
      </div>

      {/* Gradient stripe */}
      <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #7091E6, #ADBBDA)" }} />

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        <NavSection label="Platform" items={phase1} />
        <div className="mx-4 my-3 h-px" style={{ background: "rgba(173,187,218,.20)" }} />
        <NavSection label="Media AI" badge="P2" items={phase2} />
        <div className="mx-4 my-3 h-px" style={{ background: "rgba(173,187,218,.20)" }} />
        <NavSection label="Enterprise" badge="P3" items={phase3} />
      </nav>

      {/* Workspace badge */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(173,187,218,.20)" }}>
        <div
          className="px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,.10)", border: "1px solid rgba(173,187,218,.25)" }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(237,232,245,.50)" }}>Workspace</p>
          <p className="text-xs font-semibold truncate mt-0.5" style={{ color: "#EDE8F5" }}>Acme Enterprise</p>
        </div>
      </div>
    </aside>
  );
}
