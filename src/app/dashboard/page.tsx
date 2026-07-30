"use client";

import { useState, useEffect } from "react";
import { Users, Eye, Target, Plus, ArrowRight, CheckCircle2, RefreshCw, BarChart3 } from "lucide-react";
import { getSession } from "@/lib/auth";

/* ── Feature Cards Definitions (Metricool Summary style) ───────────────────── */
const FEATURE_CARDS = [
  {
    title: "How your community grows",
    desc: "Track the evolution of your followers across all your networks from",
    descLink: "one place.",
    metric: "69.4K",
    metricSub: "+12.4% Monthly",
    icon: Users,
    color: "#3D52A0",
    chartType: "line",
    chartData: [30, 35, 40, 38, 50, 55, 58, 69],
    chartColor: "#7091E6",
  },
  {
    title: "The real reach of your posts",
    desc: "Discover the reach of your posts on each network and which content",
    descLink: "performs best.",
    metric: "38.2K",
    metricSub: "+15.6% vs last month",
    icon: Eye,
    color: "#7091E6",
    chartType: "bars",
    posts: [
      { label: "Reel · Behind the scenes", val: 78, color: "#E1306C" },
      { label: "Carousel · Product launch",  val: 51, color: "#1877F2" },
      { label: "Video · Tutorial",          val: 36, color: "#010101" },
    ],
  },
  {
    title: "Your ad campaigns, at a glance",
    desc: "Analyze the performance of your ads across all platforms without",
    descLink: "switching screens.",
    metric: "3.4x",
    metricSub: "Avg. ROAS",
    icon: Target,
    color: "#8697C4",
    chartType: "campaigns",
    campaigns: [
      { label: "Summer Sale",       val: "$1.2K", perf: 84, color: "#3D52A0" },
      { label: "Brand Awareness",   val: "$3.3x",  perf: 60, color: "#7091E6" },
      { label: "Promo Launch",      val: "$2.6x",  perf: 45, color: "#8697C4" },
    ],
  },
];

/* ── Mini Line Chart ──────────────────────────────────────────────────────── */
function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 200, h = 60, pts = data.length;

  const points = data.map((v, i) => {
    const x = (i / (pts - 1)) * w;
    const y = h - ((v - min) / range) * (h - 12) - 6;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,${h} ${points} ${w},${h}`;
  const id = `line-area-${color.replace("#", "")}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${id})`} />
      <polyline points={points} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* X-axis labels */}
      {["W1", "W2", "W3", "W4", "W5", "W6", "Nov"].map((label, i) => (
        i < 7 && (
          <text
            key={label}
            x={(i / 6) * w}
            y={h + 14}
            fontSize="9"
            fill="#8697C4"
            textAnchor="middle"
            fontFamily="Plus Jakarta Sans"
          >
            {label}
          </text>
        )
      ))}
    </svg>
  );
}

/* ── Platform Connect Buttons (Metricool Connect Modal Style) ─────────────── */
const PLATFORMS = [
  { name: "Instagram",       icon: "IG", btnText: "Connect an Instagram professional account", btnColor: "#E1306C", textColor: "#fff" },
  { name: "Tiktok",          icon: "TT", btnText: "Connect a TikTok personal account",         btnColor: "#010101", textColor: "#fff" },
  { name: "Twitter",         icon: "𝕏",  btnText: "Connect a Twitter / X account",            btnColor: "#f9f9e8", textColor: "#3D52A0", outlined: true },
  { name: "LinkedIn",        icon: "in", btnText: "Reconnect LinkedIn",                        btnColor: "#f9f9e8", textColor: "#3D52A0", outlined: true },
  { name: "Tiktok Business", icon: "TT", btnText: "Connect a TikTok business account",        btnColor: "#010101", textColor: "#fff" },
  { name: "Youtube",         icon: "▶",  btnText: "Connect a YouTube channel",                btnColor: "#FF0000", textColor: "#fff" },
];

const PLATFORM_ICONS = [
  { emoji: "🔷", label: "Google" },
  { emoji: "💼", label: "LinkedIn" },
  { emoji: "📌", label: "Pinterest" },
  { emoji: "🎮", label: "Twitch" },
  { emoji: "🔵", label: "Meta" },
  { emoji: "🔺", label: "Ads" },
  { emoji: "🦋", label: "Bluesky" },
];

export default function SummaryPage() {
  const session = getSession();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  async function handleConnect(name: string) {
    setConnecting(name);
    await new Promise(r => setTimeout(r, 1200));
    setConnected(prev => [...prev, name]);
    setConnecting(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-[#3D52A0] animate-spin" />
          <p className="text-sm font-bold text-[#8697C4]">Loading workspace data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto animate-in">

      {/* ── Hero Title Section ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#3D52A0] tracking-tight leading-tight">
            Understand what works and make data-driven decisions
          </h1>
          <p className="text-sm text-[#8697C4] mt-1.5 max-w-xl">
            Analyze your community, the <span className="font-bold text-[#3D52A0]">reach of your posts</span> and your ad campaigns from a single dashboard.
          </p>
        </div>
        <button
          onClick={() => setShowConnectModal(true)}
          className="btn-primary whitespace-nowrap shrink-0 text-xs self-start"
        >
          Connect social networks
        </button>
      </div>

      {/* ── 3-Column Feature Cards (Metricool Summary Style) ──────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {FEATURE_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="card p-5 border border-[#ADBBDA] bg-white hover:border-[#7091E6] transition-all"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                  <h3 className="text-sm font-extrabold text-[#3D52A0] leading-tight">{card.title}</h3>
                  <p className="text-xs text-[#8697C4] mt-1 leading-relaxed">
                    {card.desc}{" "}
                    <span className="font-bold text-[#7091E6] cursor-pointer hover:underline">{card.descLink}</span>
                  </p>
                </div>
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}
                >
                  <Icon className="h-5 w-5" style={{ color: card.color }} />
                </div>
              </div>

              {/* Chart Visualization Area */}
              <div className="bg-[#EDE8F5]/40 rounded-xl border border-[#ADBBDA]/60 p-3 mb-3 min-h-[120px] flex flex-col justify-end">
                {card.chartType === "line" && card.chartData && (
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-[11px] font-extrabold text-[#3D52A0]">Followers</span>
                      <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-1.5 rounded">
                        {card.metricSub.split(" ")[0]}
                      </span>
                    </div>
                    <MiniLineChart data={card.chartData} color={card.chartColor || card.color} />
                  </div>
                )}

                {card.chartType === "bars" && card.posts && (
                  <div className="space-y-2">
                    {card.posts.map((post) => (
                      <div key={post.label}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-bold text-[#3D52A0] truncate max-w-[140px]">{post.label}</span>
                          <span className="text-[10px] font-extrabold" style={{ color: post.color }}>{post.val}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#ADBBDA]/40 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${post.val}%`, background: post.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {card.chartType === "campaigns" && card.campaigns && (
                  <div className="space-y-2">
                    {card.campaigns.map((campaign) => (
                      <div key={campaign.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-2 w-2 rounded-full shrink-0" style={{ background: campaign.color }} />
                          <span className="text-[10px] font-bold text-[#3D52A0] truncate">{campaign.label}</span>
                        </div>
                        <span className="text-[10px] font-extrabold text-[#3D52A0] shrink-0 ml-2">{campaign.val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Metric Footer */}
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8697C4]">
                    {card.chartType === "line" ? "Total Followers" : card.chartType === "bars" ? "Total Reach" : "Avg. ROAS"}
                  </span>
                  <div className="text-xl font-extrabold text-[#3D52A0] tracking-tight">{card.metric}</div>
                  <div className="text-[11px] font-semibold text-[#8697C4]">{card.metricSub}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#ADBBDA]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Connect Social Networks CTA Section ───────────────────────── */}
      <div className="card p-8 border border-[#ADBBDA] bg-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute right-0 top-0 w-64 h-full opacity-30 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
            <path d="M0 100 Q100 0 200 100 Q100 200 0 100Z" fill="#7091E6" opacity="0.15" />
          </svg>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-xl font-extrabold text-[#3D52A0] mb-1">Connect social networks</h2>
          <p className="text-sm text-[#8697C4] mb-5">
            Connect your accounts to unlock analytics,{" "}
            <span className="font-bold text-[#7091E6]">scheduling</span> and{" "}
            <span className="font-bold text-[#7091E6]">content management.</span>
          </p>
          <button
            onClick={() => setShowConnectModal(true)}
            className="btn-secondary text-sm font-bold"
          >
            Connect social networks
          </button>
        </div>
      </div>

      {/* ── Connect Social Networks Modal (Metricool Style) ───────────── */}
      {showConnectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(61,82,160,0.2)", backdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === e.currentTarget && setShowConnectModal(false)}
        >
          <div className="bg-white w-full max-w-[640px] rounded-2xl shadow-2xl border border-[#ADBBDA] overflow-hidden animate-in">
            {/* Modal Header */}
            <div className="px-8 pt-7 pb-4 border-b border-[#ADBBDA]">
              <h2 className="text-xl font-extrabold text-[#3D52A0]">Connect your social networks</h2>
              <p className="text-sm text-[#8697C4] mt-1">
                Link your DROX workspace with your social networks. You can modify it later.
              </p>
              {/* Multicolor Progress Bar */}
              <div className="h-1 w-full mt-4 rounded-full overflow-hidden flex">
                <div className="h-full w-1/4 bg-[#3D52A0]" />
                <div className="h-full w-1/4 bg-[#7091E6]" />
                <div className="h-full w-1/4 bg-[#ADBBDA]" />
                <div className="h-full w-1/4 bg-[#EDE8F5]" />
              </div>
            </div>

            {/* Platform Grid */}
            <div className="px-8 py-6 grid grid-cols-2 gap-5">
              {PLATFORMS.map((p) => {
                const isConnected = connected.includes(p.name);
                const isConnecting = connecting === p.name;

                return (
                  <div key={p.name}>
                    {/* Platform Label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-black border"
                        style={{ color: p.btnColor === "#f9f9e8" ? "#3D52A0" : p.btnColor, borderColor: "#ADBBDA", background: "#EDE8F5" }}
                      >
                        {p.icon}
                      </div>
                      <span className="font-extrabold text-sm text-[#3D52A0]">{p.name}</span>
                    </div>

                    {/* Connect Button */}
                    <button
                      onClick={() => !isConnected && handleConnect(p.name)}
                      disabled={isConnecting}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: isConnected ? "#ECFDF5" : p.btnColor,
                        color: isConnected ? "#059669" : p.textColor,
                        border: isConnected ? "1px solid #A7F3D0" : p.outlined ? "1px solid #ADBBDA" : "none",
                        cursor: isConnected ? "default" : "pointer",
                      }}
                    >
                      <span>
                        {isConnecting ? "Connecting..." :
                         isConnected  ? "✓ Connected" :
                         p.btnText}
                      </span>
                      {isConnecting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" style={{ color: p.textColor }} />
                      ) : isConnected ? (
                        <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                      ) : (
                        <span className="text-lg font-black opacity-80">{p.icon}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Partnership Footer */}
            <div className="px-8 pb-4 text-center">
              <p className="text-xs text-[#8697C4] font-medium mb-2">DROX is a partner of Google and Meta and is authorized by:</p>
              <div className="flex items-center justify-center gap-3 text-base">
                {PLATFORM_ICONS.map((p) => (
                  <span key={p.label} title={p.label} className="cursor-default">{p.emoji}</span>
                ))}
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="flex items-center justify-between px-8 py-4 border-t border-[#ADBBDA] bg-[#EDE8F5]/40">
              <button
                onClick={() => setShowConnectModal(false)}
                className="btn-secondary text-sm font-bold"
              >
                Previous
              </button>
              <button
                onClick={() => setShowConnectModal(false)}
                className="btn-primary text-sm font-bold"
                style={{ background: "#3D52A0" }}
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
