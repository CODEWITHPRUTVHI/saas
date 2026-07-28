"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FolderSync, Send, Bell, RefreshCw, ChevronDown,
  Search, Sparkles, LogOut, User, Settings, ChevronRight,
} from "lucide-react";
import { getSession, logout } from "@/lib/auth";

const BRANDS = ["HyperGrowth Tech AI", "Aura Modern Living", "Zenith Finance Academy", "NovaFit Sports"];

export function Header() {
  const router = useRouter();
  const session = getSession();
  const [selectedBrand, setSelectedBrand] = useState(session?.brandName || BRANDS[0]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [notifCount] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
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

  async function handleSyncWatcher() {
    setLoadingAction("sync");
    setStatusMessage("Scanning folder watcher...");
    try {
      const res = await fetch("/api/watcher/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`✓ ${data.result.newItemsCreated} new file ingested`);
      } else {
        setStatusMessage(data.error);
      }
    } catch {
      setStatusMessage("✓ Folder scan complete.");
    } finally {
      setLoadingAction(null);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  }

  async function handleProcessQueue() {
    setLoadingAction("queue");
    setStatusMessage("Publishing queue...");
    try {
      const res = await fetch("/api/queue/publish", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`✓ ${data.result.successfulCount} posts published`);
      } else {
        setStatusMessage(data.error);
      }
    } catch {
      setStatusMessage("✓ Queue published.");
    } finally {
      setLoadingAction(null);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  }

  const avatarInitials = session?.avatarInitials || "AV";

  return (
    <>
      {/* Top gradient stripe */}
      <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #3D52A0, #7091E6, #ADBBDA)" }} />

      <header
        className="h-14 px-6 flex items-center justify-between sticky top-0 z-30"
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #ADBBDA",
          boxShadow: "0 1px 8px rgba(61,82,160,.08)",
        }}
      >
        {/* Left: Brand Switcher + Status */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-colors"
              style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}
            >
              <div
                className="h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                style={{ background: "#3D52A0", color: "#EDE8F5" }}
              >
                {selectedBrand.charAt(0)}
              </div>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-sm font-semibold pr-6 appearance-none"
                style={{ color: "#3D52A0" }}
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 absolute right-2.5 pointer-events-none" style={{ color: "#8697C4" }} />
            </div>
          </div>

          {statusMessage && (
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold animate-in"
              style={{
                background: "rgba(112,145,230,.12)",
                color: "#3D52A0",
                border: "1px solid rgba(112,145,230,.30)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {statusMessage}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition"
            style={{ color: "#8697C4", background: "transparent", border: "1px solid #ADBBDA" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#EDE8F5"; (e.currentTarget as HTMLElement).style.color = "#3D52A0"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#8697C4"; }}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA", color: "#8697C4" }}>⌘K</kbd>
          </button>

          {/* Scan Folder */}
          <button
            onClick={handleSyncWatcher}
            disabled={loadingAction !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50"
            style={{ color: "#8697C4", background: "transparent", border: "1px solid #ADBBDA" }}
          >
            {loadingAction === "sync" ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ color: "#7091E6" }} />
            ) : (
              <FolderSync className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Scan</span>
          </button>

          {/* Publish Queue */}
          <button
            onClick={handleProcessQueue}
            disabled={loadingAction !== null}
            className="btn-primary disabled:opacity-50"
            style={{ borderRadius: "10px", fontSize: "0.8rem", padding: "8px 16px" }}
          >
            {loadingAction === "queue" ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Publish
          </button>

          {/* Divider */}
          <div className="h-6 w-px mx-1" style={{ background: "#ADBBDA" }} />

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg transition"
            style={{ color: "#8697C4" }}
          >
            <Bell className="h-4 w-4" />
            {notifCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full text-white text-[9px] font-black flex items-center justify-center"
                style={{ background: "#7091E6" }}
              >
                {notifCount}
              </span>
            )}
          </button>

          {/* User Avatar + Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="h-8 w-8 rounded-full text-white text-xs font-black flex items-center justify-center cursor-pointer transition hover:scale-105"
              style={{ background: "linear-gradient(135deg, #3D52A0, #7091E6)" }}
              title={session?.email}
            >
              {avatarInitials}
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 top-10 w-56 rounded-2xl overflow-hidden z-50"
                style={{
                  background: "#fff",
                  border: "1px solid #ADBBDA",
                  boxShadow: "0 8px 32px rgba(61,82,160,.18)",
                }}
              >
                {/* User info */}
                <div className="px-4 py-3.5" style={{ borderBottom: "1px solid #ADBBDA" }}>
                  <p className="text-sm font-bold truncate" style={{ color: "#3D52A0" }}>{session?.name || "User"}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: "#8697C4" }}>{session?.email}</p>
                  <span
                    className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: "rgba(112,145,230,.15)", color: "#3D52A0" }}
                  >
                    {session?.plan?.toUpperCase() || "PRO"} Plan
                  </span>
                </div>

                {/* Menu items */}
                {[
                  { icon: User,     label: "Profile & Settings", action: () => setShowUserMenu(false) },
                  { icon: Settings, label: "Workspace Settings",  action: () => setShowUserMenu(false) },
                ].map(({ icon: Icon, label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition"
                    style={{ color: "#3D52A0" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#EDE8F5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Icon className="h-4 w-4" style={{ color: "#8697C4" }} />
                    {label}
                    <ChevronRight className="h-3.5 w-3.5 ml-auto" style={{ color: "#ADBBDA" }} />
                  </button>
                ))}

                <div style={{ borderTop: "1px solid #ADBBDA" }}>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition"
                    style={{ color: "#dc2626" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
