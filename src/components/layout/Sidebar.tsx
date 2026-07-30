"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, FileText, Hash, Settings, Plus, LayoutDashboard,
  Inbox, Calendar, Link2, Megaphone, Zap
} from "lucide-react";

const SOCIAL_ACCOUNTS = [
  { name: "Instagram", icon: "IG", color: "#E1306C", bg: "#fce7f3", href: "/dashboard/accounts/instagram" },
  { name: "Facebook",  icon: "f",  color: "#1877F2", bg: "#dbeafe", href: "/dashboard/accounts/facebook" },
  { name: "TikTok",    icon: "TT", color: "#010101", bg: "#f3f4f6", href: "/dashboard/accounts/tiktok" },
  { name: "YouTube",   icon: "▶",  color: "#FF0000", bg: "#fee2e2", href: "/dashboard/accounts/youtube" },
  { name: "LinkedIn",  icon: "in", color: "#0A66C2", bg: "#dbeafe", href: "/dashboard/accounts/linkedin", connected: true },
];

const BOTTOM_NAV = [
  { name: "Reporting",        href: "/dashboard/analytics",  icon: BarChart3,       badge: "New" },
  { name: "Reports",          href: "/dashboard/reports",    icon: FileText },
  { name: "Hashtag Tracker",  href: "/dashboard/watchers",   icon: Hash },
  { name: "Brand settings",   href: "/dashboard/brands",     icon: Settings },
];

function PlatformButton({ account }: { account: typeof SOCIAL_ACCOUNTS[0] }) {
  const pathname = usePathname();
  const isActive = pathname === account.href;

  return (
    <Link
      href={account.href}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all group ${
        isActive ? "bg-[#3D52A0]/10 border border-[#3D52A0]/20" : "hover:bg-[#ADBBDA]/20"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
          style={{ background: account.bg, color: account.color }}
        >
          {account.icon}
        </div>
        <span className={`text-sm font-semibold ${ isActive ? "text-[#3D52A0] font-extrabold" : "text-[#3D52A0]" }`}>
          {account.name}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {account.connected ? (
          <span className="h-5 w-5 rounded-full bg-[#EDE8F5] border-2 border-[#ADBBDA] flex items-center justify-center">
            <span className="text-[8px] font-black text-[#8697C4]">✓</span>
          </span>
        ) : (
          <Plus className="h-4 w-4 text-[#ADBBDA] group-hover:text-[#3D52A0] transition-colors" />
        )}
      </div>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-52 min-w-[208px] flex flex-col h-screen sticky top-0 z-40"
      style={{ background: "#FFFFFF", borderRight: "1px solid #ADBBDA" }}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#ADBBDA]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-[#3D52A0] flex items-center justify-center">
            <Zap className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <span className="font-black text-[15px] text-[#3D52A0] tracking-tight">DROX</span>
          </div>
        </div>
      </div>

      {/* Summary nav item at top */}
      <div className="px-3 pt-3">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
            pathname === "/dashboard"
              ? "bg-[#3D52A0] text-white"
              : "text-[#3D52A0] hover:bg-[#EDE8F5]"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Summary
        </Link>
      </div>

      {/* Social Accounts Section */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-2">
        {/* Accounts List */}
        <div className="space-y-0.5">
          {SOCIAL_ACCOUNTS.map((acc) => (
            <PlatformButton key={acc.name} account={acc} />
          ))}
        </div>

        {/* More connections button */}
        <Link
          href="/dashboard/accounts"
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border-2 border-dashed border-[#ADBBDA] text-[#3D52A0] text-xs font-bold hover:border-[#7091E6] hover:bg-[#EDE8F5] transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          More connections
        </Link>

        {/* Divider */}
        <div className="my-4 h-px bg-[#ADBBDA]" />

        {/* Bottom Nav */}
        <div className="space-y-0.5">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#EDE8F5] text-[#3D52A0]"
                    : "text-[#8697C4] hover:bg-[#EDE8F5] hover:text-[#3D52A0]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {item.name}
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#7091E6] text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
