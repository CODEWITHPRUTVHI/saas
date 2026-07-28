"use client";

import { useState } from "react";
import {
  FolderSync, CalendarDays, Cpu, Share2, Sparkles,
  Clock, Play, Layers, ArrowUpRight, TrendingUp, Plus, RefreshCw,
} from "lucide-react";
import { getSession } from "@/lib/auth";

const QUEUE_ITEMS = [
  { platform: "YouTube",   icon: "▶",  color: "#3D52A0", bg: "rgba(61,82,160,.10)",  title: "Building Enterprise AI Content OS Pipelines", time: "Today • 16:30", status: "Ready" },
  { platform: "Instagram", icon: "📸", color: "#7091E6", bg: "rgba(112,145,230,.10)", title: "Reels Cut: Turn 1 Raw Video into 5 Platform Cuts", time: "Today • 19:30", status: "Queued" },
  { platform: "TikTok",    icon: "🎵", color: "#8697C4", bg: "rgba(134,151,196,.10)", title: "TikTok Vertical: Zero Manual Editing Pipeline Demo", time: "Tomorrow • 09:00", status: "Queued" },
  { platform: "LinkedIn",  icon: "💼", color: "#ADBBDA", bg: "rgba(173,187,218,.15)", title: "Enterprise Workflow Automation — Behind the Stack", time: "Tomorrow • 14:00", status: "Queued" },
];

const PLATFORMS_CONNECTED = [
  { name: "YouTube",   followers: "12.4K", color: "#3D52A0", pct: 82 },
  { name: "Instagram", followers: "8.7K",  color: "#7091E6", pct: 63 },
  { name: "TikTok",    followers: "31.2K", color: "#8697C4", pct: 95 },
  { name: "LinkedIn",  followers: "5.1K",  color: "#ADBBDA", pct: 41 },
];

export default function DashboardOverview() {
  const session = getSession();
  const [transcript, setTranscript] = useState(
    "Demonstrating our AI Content Distribution OS. Raw video files placed into monitored Google Drive folders are automatically parsed, passed to Claude for structured multi-channel JSON metadata generation, and enqueued into a smart timezone-aware publishing queue for YouTube, Instagram Reels, and TikTok."
  );
  const [aiResult, setAiResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"youtube" | "instagram" | "tiktok" | "linkedin">("youtube");

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, brandVoiceProfile: "Futuristic, energetic, data-driven" }),
      });
      const data = await res.json();
      if (data.success) setAiResult(data.metadata);
    } catch {}
    finally { setIsGenerating(false); }
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">
            Welcome back, {session?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="page-subtitle">AI-powered publishing pipeline · All systems operational</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 badge badge-success text-xs px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
            Live
          </span>
          <button className="btn-primary" style={{ padding: "9px 18px", fontSize: "0.8rem", borderRadius: "10px" }}>
            <Plus className="h-3.5 w-3.5" />
            New Content
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Folder Watchers",  value: "2 Active",      sub: "Google Drive + Local",    icon: FolderSync,   iconColor: "#3D52A0", trend: null },
          { label: "Queue Entries",    value: "6 Scheduled",   sub: "Next post in 15 mins",    icon: CalendarDays, iconColor: "#7091E6", trend: "+2 today" },
          { label: "AI Jobs Today",    value: "12 Completed",  sub: "100% valid JSON output",  icon: Cpu,          iconColor: "#8697C4", trend: null },
          { label: "Social Accounts",  value: "4 Connected",   sub: "YouTube · IG · TikTok",   icon: Share2,       iconColor: "#ADBBDA", trend: null },
        ].map(({ label, value, sub, icon: Icon, iconColor, trend }) => (
          <div key={label} className="metric-card">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl" style={{ background: "rgba(61,82,160,.08)" }}>
                <Icon className="h-4 w-4" style={{ color: iconColor }} />
              </div>
              {trend && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <TrendingUp className="h-3 w-3" /> {trend}
                </span>
              )}
            </div>
            <div className="font-bold text-xl leading-tight" style={{ color: "#3D52A0" }}>{value}</div>
            <div className="text-xs mt-1" style={{ color: "#8697C4" }}>{label}</div>
            <div className="text-[11px] mt-0.5 font-medium" style={{ color: "#ADBBDA" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Platform Performance */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-[15px]" style={{ color: "#3D52A0" }}>Platform Performance</h2>
            <p className="text-xs mt-0.5" style={{ color: "#8697C4" }}>Last 30 days</p>
          </div>
          <a href="/dashboard/analytics" className="flex items-center gap-1 text-xs font-semibold hover:underline" style={{ color: "#7091E6" }}>
            Full Analytics <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PLATFORMS_CONNECTED.map((p) => (
            <div key={p.name} className="p-4 rounded-xl transition" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                <span className="text-xs font-bold" style={{ color: "#8697C4" }}>{p.name}</span>
              </div>
              <div className="font-bold text-lg" style={{ color: "#3D52A0" }}>{p.followers}</div>
              <div className="text-[11px] font-medium" style={{ color: "#8697C4" }}>Followers</div>
              <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "#ADBBDA" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Queue + Watchers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Smart Queue */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #ADBBDA" }}>
            <div>
              <h2 className="font-bold text-[15px]" style={{ color: "#3D52A0" }}>Smart Publishing Queue</h2>
              <p className="text-xs mt-0.5" style={{ color: "#8697C4" }}>Timezone-optimized scheduling</p>
            </div>
            <span className="badge badge-info">6 Due</span>
          </div>
          <div className="divide-y" style={{ borderColor: "#ADBBDA" }}>
            {QUEUE_ITEMS.map((item, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 transition" style={{ background: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#EDE8F5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: item.bg }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1" style={{ color: "#3D52A0" }}>{item.title}</p>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "#8697C4" }}>
                    <Clock className="h-3 w-3" /> {item.time}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: item.bg, color: item.color }}>
                    {item.status}
                  </span>
                  <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: item.color }}>
                    {item.status === "Ready" && <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3" style={{ borderTop: "1px solid #ADBBDA", background: "#EDE8F5" }}>
            <a href="/dashboard/queue" className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: "#7091E6" }}>
              View full queue <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Watchers Panel */}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid #ADBBDA" }}>
            <h2 className="font-bold text-[15px]" style={{ color: "#3D52A0" }}>Folder Watchers</h2>
            <p className="text-xs mt-0.5" style={{ color: "#8697C4" }}>Autonomous file ingest</p>
          </div>
          <div className="p-5 space-y-3">
            {[
              { name: "Google Drive", path: "HyperGrowth/RawIngest", polled: "15m ago", synced: "1 file",  active: true },
              { name: "Local Studio", path: "/Volumes/Media/RawDrop",  polled: "45m ago", synced: "Idle",    active: true },
              { name: "Dropbox",      path: "Not connected",           polled: "—",       synced: "—",        active: false },
            ].map((w, i) => (
              <div key={i} className="p-4 rounded-xl transition" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: "#3D52A0" }}>{w.name}</span>
                  <span className={`badge ${w.active ? "badge-success" : "badge-neutral"}`}>
                    {w.active ? "Active" : "Off"}
                  </span>
                </div>
                <p className="text-[11px] font-mono truncate" style={{ color: "#8697C4" }}>{w.path}</p>
                {w.active && (
                  <div className="flex items-center justify-between mt-2 text-[11px]" style={{ color: "#8697C4" }}>
                    <span>Polled {w.polled}</span>
                    <span className="font-semibold" style={{ color: "#3D52A0" }}>{w.synced}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <a href="/dashboard/watchers"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold transition"
              style={{ border: "1px solid #ADBBDA", color: "#8697C4" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#3D52A0"; e.currentTarget.style.borderColor = "#3D52A0"; e.currentTarget.style.background = "#EDE8F5"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#8697C4"; e.currentTarget.style.borderColor = "#ADBBDA"; e.currentTarget.style.background = "transparent"; }}
            >
              <Plus className="h-3.5 w-3.5" /> Add Storage
            </a>
          </div>
        </div>
      </div>

      {/* AI SEO Generator */}
      <div className="card overflow-hidden">
        <div className="h-1 gradient-stripe" />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="font-bold text-[15px] flex items-center gap-2" style={{ color: "#3D52A0" }}>
                <Sparkles className="h-4 w-4" style={{ color: "#7091E6" }} />
                AI Multi-Platform Metadata Generator
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#8697C4" }}>Paste transcript → AI generates structured metadata for all channels</p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary disabled:opacity-50 shrink-0"
              style={{ padding: "10px 20px", fontSize: "0.85rem", borderRadius: "10px" }}
            >
              {isGenerating ? <><RefreshCw className="h-4 w-4 animate-spin" /> Generating...</> : <><Play className="h-4 w-4 fill-current" /> Generate Metadata</>}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="text-micro mb-2 block">Raw Input</label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={7}
                className="input font-mono text-xs leading-relaxed resize-none"
                placeholder="Paste video transcript or content summary..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-micro">Platform Output</label>
                <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#EDE8F5", border: "1px solid #ADBBDA" }}>
                  {(["youtube", "instagram", "tiktok", "linkedin"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition"
                      style={{
                        background: activeTab === tab ? "#3D52A0" : "transparent",
                        color: activeTab === tab ? "#EDE8F5" : "#8697C4",
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="input h-[170px] overflow-y-auto font-mono text-xs leading-relaxed p-3" style={{ background: "#EDE8F5" }}>
                {aiResult ? (
                  <div className="space-y-2">
                    {activeTab === "youtube" && (
                      <>
                        <p className="font-bold" style={{ color: "#3D52A0" }}>{aiResult.youtube?.title}</p>
                        <p style={{ color: "#8697C4" }}>{aiResult.youtube?.description?.slice(0, 200)}...</p>
                        <p style={{ color: "#7091E6" }}>{aiResult.youtube?.tags?.slice(0, 6).join(" · ")}</p>
                      </>
                    )}
                    {activeTab === "instagram" && (
                      <>
                        <p style={{ color: "#8697C4" }}>{aiResult.instagram?.caption?.slice(0, 200)}...</p>
                        <p className="font-semibold" style={{ color: "#7091E6" }}>{aiResult.instagram?.hashtags?.slice(0, 8).join(" ")}</p>
                      </>
                    )}
                    {activeTab === "tiktok" && (
                      <>
                        <p style={{ color: "#8697C4" }}>{aiResult.tiktok?.caption}</p>
                        <p style={{ color: "#7091E6" }}>{aiResult.tiktok?.keywords?.join(", ")}</p>
                      </>
                    )}
                    {activeTab === "linkedin" && (
                      <p style={{ color: "#8697C4" }}>{aiResult.linkedin?.post?.slice(0, 300)}...</p>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-2" style={{ color: "#ADBBDA" }}>
                    <Layers className="h-6 w-6 opacity-50" />
                    <p className="text-[11px]">Click Generate to run the AI engine</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
