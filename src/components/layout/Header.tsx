"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  BarChart3, Inbox, Calendar, Link2, Megaphone, LogOut, ChevronDown,
  Settings, User, Shield, Menu, X
} from "lucide-react";
import { getSession, logout } from "@/lib/auth";

const TOP_NAV = [
  { label: "Analytics",   href: "/dashboard",           icon: BarChart3 },
  { label: "Reporting",   href: "/dashboard/analytics",  icon: BarChart3, badge: "New" },
  { label: "Inbox",       href: "/dashboard/queue",      icon: Inbox },
  { label: "Planning",    href: "/dashboard/assets",     icon: Calendar },
  { label: "SmartLinks",  href: "/dashboard/brand-kits", icon: Link2 },
  { label: "Ads",         href: "/dashboard/approvals",  icon: Megaphone },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const session = getSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const avatarInitials = session?.avatarInitials || "AV";

  return (
    <header
      className="h-14 px-6 flex items-center justify-between sticky top-0 z-30 bg-[#3D52A0] border-b border-[#7091E6]/40"
      role="banner"
    >
      {/* Top Navigation Tabs */}
      <nav className="flex items-center gap-1">
        {TOP_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-[#ADBBDA] hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#7091E6] text-white">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-white rounded-full" />
              )}
            </a>
          );
        })}
      </nav>

      {/* Right: Upgrade + Avatar */}
      <div className="flex items-center gap-2.5">
        <button
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all"
          style={{ background: "#EDE8F5", color: "#3D52A0" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#ADBBDA")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#EDE8F5")}
        >
          <Shield className="h-3.5 w-3.5" />
          Upgrade your plan
        </button>

        {/* User Avatar */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="h-8 w-8 rounded-full bg-[#7091E6] border-2 border-white/30 text-white text-xs font-extrabold flex items-center justify-center hover:scale-105 transition-transform"
          >
            {avatarInitials}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-11 w-56 rounded-xl bg-white border border-[#ADBBDA] shadow-xl z-50 overflow-hidden animate-in">
              <div className="p-4 border-b border-[#ADBBDA]">
                <p className="text-xs font-extrabold text-[#3D52A0] truncate">{session?.name || "User"}</p>
                <p className="text-[11px] text-[#8697C4] truncate mt-0.5">{session?.email}</p>
              </div>

              <div className="py-1">
                {[
                  { icon: User, label: "Account settings" },
                  { icon: Settings, label: "Brand settings" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Icon className="h-3.5 w-3.5 text-[#8697C4]" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="border-t border-[#ADBBDA]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
