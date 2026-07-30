"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Users, Eye, BarChart3, TrendingUp, Layers, PlaySquare,
  Monitor, RefreshCw, CheckCircle2, X, ChevronRight, ArrowRight
} from "lucide-react";

/* ── Per-Platform Configuration ─────────────────────────────────────────── */
const PLATFORM_CONFIG: Record<string, {
  name: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  brandColor: string;
  connectLabel: string;
  heroTitle: string;
  heroDesc: string;
  features: { title: string; desc: string; icon: any }[];
  authType: "direct" | "google";
}> = {
  instagram: {
    name: "Instagram",
    icon: "IG",
    iconBg: "#fce7f3",
    iconColor: "#E1306C",
    brandColor: "#E1306C",
    connectLabel: "Connect Instagram",
    heroTitle: "Connect your Instagram account",
    heroDesc: "Discover how your community grows, what content performs best and how you compare to your competitors.",
    authType: "direct",
    features: [
      { title: "Get to know your audience", desc: "Track your follower growth and discover their gender, age, country and city.", icon: Users },
      { title: "Analyze each format separately", desc: "Check the reach, views and engagement of your posts, reels and stories in detail.", icon: Eye },
      { title: "Monitor your competitors", desc: "Add competitor accounts and compare their evolution with yours.", icon: BarChart3 },
    ],
  },
  facebook: {
    name: "Facebook",
    icon: "f",
    iconBg: "#dbeafe",
    iconColor: "#1877F2",
    brandColor: "#1877F2",
    connectLabel: "Connect Facebook",
    heroTitle: "Connect your Facebook Page",
    heroDesc: "Analyze your page performance, follower growth and post engagement in one place.",
    authType: "direct",
    features: [
      { title: "Page analytics at a glance", desc: "See reach, impressions and page likes broken down by day and post type.", icon: BarChart3 },
      { title: "Engagement breakdown", desc: "Understand how your audience interacts with each type of content you publish.", icon: Users },
      { title: "Competitor benchmarking", desc: "Compare your page's growth and engagement against similar pages in your niche.", icon: TrendingUp },
    ],
  },
  tiktok: {
    name: "TikTok",
    icon: "TT",
    iconBg: "#f3f4f6",
    iconColor: "#010101",
    brandColor: "#010101",
    connectLabel: "Connect TikTok",
    heroTitle: "Connect your TikTok account",
    heroDesc: "Analyze your TikTok performance, track viral content and optimize your posting schedule.",
    authType: "direct",
    features: [
      { title: "Viral video insights", desc: "Identify which videos go viral and what elements drive watch time and shares.", icon: PlaySquare },
      { title: "Follower demographics", desc: "Explore when your followers are online, their age range, and top regions.", icon: Users },
      { title: "Trend performance", desc: "Compare content formats and see which hooks, sounds, and styles perform best.", icon: TrendingUp },
    ],
  },
  youtube: {
    name: "YouTube",
    icon: "▶",
    iconBg: "#fee2e2",
    iconColor: "#FF0000",
    brandColor: "#FF0000",
    connectLabel: "Connect YouTube",
    heroTitle: "Connect your YouTube channel",
    heroDesc: "Analyze the performance of your content and grow your channel faster.",
    authType: "google",
    features: [
      { title: "Complete channel analytics", desc: "Subscribers, views, watch time and thumbnail CTR. All in one dashboard.", icon: Monitor },
      { title: "Video performance details", desc: "See which videos drive the most growth and what topics your audience loves.", icon: PlaySquare },
      { title: "Analyze Shorts and live streams", desc: "Specific metrics for YouTube Shorts and live streams with performance comparisons.", icon: Eye },
    ],
  },
  linkedin: {
    name: "LinkedIn",
    icon: "in",
    iconBg: "#dbeafe",
    iconColor: "#0A66C2",
    brandColor: "#0A66C2",
    connectLabel: "Connect LinkedIn",
    heroTitle: "Connect your LinkedIn profile",
    heroDesc: "Track your professional reach, content engagement and follower growth on LinkedIn.",
    authType: "direct",
    features: [
      { title: "Professional audience insights", desc: "Understand your followers' industries, seniority, and company sizes.", icon: Users },
      { title: "Post performance metrics", desc: "Measure impressions, clicks, reactions and comments for each post.", icon: BarChart3 },
      { title: "Company page analytics", desc: "Monitor your LinkedIn Company Page's visibility and follower evolution.", icon: Layers },
    ],
  },
};

/* ── Google Sign-In Modal ────────────────────────────────────────────────── */
function GoogleSignInModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (email: string) => void;
}) {
  const accounts = [
    { name: "Pruthviraj Chavan", email: "pruthvirajchavan973@gmail.com", avatar: "PC" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Google-style dark dialog */}
      <div className="w-[360px] rounded-2xl overflow-hidden shadow-2xl animate-in" style={{ background: "#202124", border: "1px solid #3c4043" }}>
        {/* Close button */}
        <div className="flex items-center justify-end px-4 pt-3">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors text-[#9aa0a6]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Header */}
        <div className="px-10 pb-6 text-center">
          {/* Google Logo */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.7-6.7C35.5 2.5 30.1 0 24 0 14.6 0 6.5 5.5 2.6 13.5l7.8 6C12.2 13 17.7 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.3-9.4 6.3-16.2z"/>
              <path fill="#FBBC05" d="M10.4 28.5c-.6-1.7-.9-3.5-.9-5.5s.3-3.8.9-5.5l-7.8-6C1 14.5 0 19.1 0 24s1 9.5 2.6 13.5l7.8-6z"/>
              <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15.1-5.4l-7-5.4c-2 1.3-4.5 2.1-8.1 2.1-6.3 0-11.7-3.5-13.6-8.8l-7.8 6C6.5 42.5 14.6 48 24 48z"/>
            </svg>
            <span className="text-[13px] font-medium text-[#e8eaed]">Sign in with Google</span>
          </div>

          {/* App Icon (DROX) */}
          <div className="w-12 h-12 rounded-lg bg-[#3D52A0] flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-white text-sm font-black">DX</span>
          </div>

          <h2 className="text-xl font-normal text-[#e8eaed] mb-1">Choose an account</h2>
          <p className="text-sm text-[#9aa0a6]">to continue to <span className="font-medium text-[#e8eaed]">DROX</span></p>
        </div>

        {/* Accounts List */}
        <div style={{ borderTop: "1px solid #3c4043", borderBottom: "1px solid #3c4043" }}>
          {accounts.map((acc) => (
            <button
              key={acc.email}
              onClick={() => onSelect(acc.email)}
              className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-white/5 transition-colors text-left"
            >
              <div className="h-9 w-9 rounded-full bg-[#3D52A0] flex items-center justify-center text-xs font-bold text-white shrink-0">
                {acc.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-[#e8eaed]">{acc.name}</p>
                <p className="text-xs text-[#9aa0a6]">{acc.email}</p>
              </div>
            </button>
          ))}

          <button className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-white/5 transition-colors">
            <div className="h-9 w-9 rounded-full bg-[#3c4043] flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-[#9aa0a6]" />
            </div>
            <span className="text-sm text-[#9aa0a6]">Use another account</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 px-6 py-4">
          <a href="#" className="text-xs text-[#8ab4f8] hover:underline">English (United States)</a>
          <a href="#" className="text-xs text-[#8ab4f8] hover:underline">Help</a>
          <a href="#" className="text-xs text-[#8ab4f8] hover:underline">Privacy</a>
          <a href="#" className="text-xs text-[#8ab4f8] hover:underline">Terms</a>
        </div>
      </div>
    </div>
  );
}

/* ── Platform Page ────────────────────────────────────────────────────────── */
export default function PlatformPage() {
  const params = useParams();
  const platform = (params?.platform as string)?.toLowerCase() || "instagram";
  const config = PLATFORM_CONFIG[platform] ?? PLATFORM_CONFIG.instagram;

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  async function handleConnect() {
    if (config.authType === "google") {
      setShowGoogleModal(true);
      return;
    }
    // Direct OAuth for non-Google platforms
    setConnecting(true);
    await new Promise(r => setTimeout(r, 1500));
    setConnecting(false);
    setConnected(true);
  }

  async function handleGoogleAccountSelect(email: string) {
    setShowGoogleModal(false);
    setConnecting(true);
    setSelectedAccount(email);
    await new Promise(r => setTimeout(r, 1800));
    setConnecting(false);
    setConnected(true);
  }

  return (
    <div className="max-w-[900px] mx-auto animate-in">

      {/* Platform Name Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black"
          style={{ background: config.iconBg, color: config.iconColor }}
        >
          {config.icon}
        </div>
        <h1 className="text-xl font-extrabold text-[#3D52A0] tracking-tight">{config.name}</h1>
      </div>

      {/* Hero Connection Banner */}
      <div className="card p-6 bg-white border border-[#ADBBDA] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-base font-extrabold text-[#3D52A0] mb-1">{config.heroTitle}</h2>
          <p className="text-sm text-[#8697C4] leading-relaxed">{config.heroDesc}</p>
        </div>

        {connected ? (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] font-bold text-sm shrink-0">
            <CheckCircle2 className="h-4 w-4" />
            Connected!
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="px-5 py-2.5 rounded-xl text-sm font-extrabold text-white transition-all shrink-0 flex items-center gap-2 shadow-md"
            style={{
              background: config.brandColor === "#010101" ? "#111111" : config.brandColor,
              opacity: connecting ? 0.8 : 1,
            }}
          >
            {connecting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              config.connectLabel
            )}
          </button>
        )}
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {config.features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="card p-5 bg-white border border-[#ADBBDA] hover:border-[#7091E6] transition-all"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-extrabold text-[#3D52A0] leading-tight flex-1 pr-2">
                  {feature.title}
                </h3>
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-[#EDE8F5] border border-[#ADBBDA]">
                  <Icon className="h-5 w-5 text-[#7091E6]" />
                </div>
              </div>
              <p className="text-xs text-[#8697C4] leading-relaxed">{feature.desc}</p>

              {/* Mini preview mockup placeholder */}
              <div className="mt-4 h-20 rounded-xl bg-[#EDE8F5]/60 border border-[#ADBBDA]/50 flex items-center justify-center">
                <Icon className="h-7 w-7 text-[#ADBBDA]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Social Networks CTA (same as main dashboard) */}
      <div className="card p-7 bg-white border border-[#ADBBDA] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-56 h-full opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
            <path d="M0 100 Q100 0 200 100 Q100 200 0 100Z" fill="#7091E6" opacity="0.3" />
          </svg>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-lg font-extrabold text-[#3D52A0] mb-1">Connect social networks</h2>
          <p className="text-sm text-[#8697C4] mb-4">
            Connect your accounts to unlock analytics,{" "}
            <span className="font-bold text-[#7091E6]">scheduling</span> and{" "}
            <span className="font-bold text-[#7091E6]">content management.</span>
          </p>
          <button
            onClick={handleConnect}
            className="btn-secondary text-sm font-bold"
          >
            Connect social networks
          </button>
        </div>
      </div>

      {/* Google Sign-In Modal (YouTube only) */}
      {showGoogleModal && (
        <GoogleSignInModal
          onClose={() => setShowGoogleModal(false)}
          onSelect={handleGoogleAccountSelect}
        />
      )}
    </div>
  );
}
