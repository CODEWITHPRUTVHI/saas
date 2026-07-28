"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Eye, Heart, Share2, Trophy, Globe, RefreshCw } from "lucide-react";
import { aggregateWorkspaceAnalytics, formatNumber, type WorkspaceAnalyticsSummary } from "@/lib/analytics/analytics-aggregator";

const DEMO_BRANDS = [
  { id: "b-1", name: "HyperGrowth Tech AI" },
  { id: "b-2", name: "Aura Modern Living" },
  { id: "b-3", name: "Zenith Finance Academy" },
  { id: "b-4", name: "NovaFit Sports" },
  { id: "b-5", name: "CraftBrew Collective" },
  { id: "b-6", name: "UrbanLens Photography" },
];

const PLATFORM_COLORS: Record<string, string> = {
  YOUTUBE:  "#ef4444",
  INSTAGRAM:"#ec4899",
  TIKTOK:   "#06b6d4",
  FACEBOOK: "#3b82f6",
  LINKEDIN: "#6366f1",
  PINTEREST:"#dc2626",
  TWITTER:  "#64748b",
};

const PLATFORM_ICONS: Record<string, string> = {
  YOUTUBE:  "▶",
  INSTAGRAM:"📸",
  TIKTOK:   "🎵",
  FACEBOOK: "👥",
  LINKEDIN: "💼",
  PINTEREST:"📌",
  TWITTER:  "𝕏",
};

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.round((value / Math.max(max, 1)) * 100);
  return (
    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function SparkLine({ points, color }: { points: number[]; color: string }) {
  if (!points.length) return null;
  const max = Math.max(...points, 1);
  const min = Math.min(...points);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const step = w / (points.length - 1);
  const coords = points.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={coords} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<WorkspaceAnalyticsSummary | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState<string>("ALL");

  useEffect(() => {
    aggregateWorkspaceAnalytics(DEMO_BRANDS).then((d) => {
      setData(d);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-brand-accent animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const filteredBrands = selectedBrand === "ALL" ? data.brands : data.brands.filter((b) => b.brandId === selectedBrand);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <BarChart3 className="h-6 w-6" style={{ color: '#7091E6' }} />
            Multi-Brand Analytics
          </h1>
          <p className="page-subtitle">
            Aggregate reach, engagement, and growth across all {data.totalBrands} brand accounts.
          </p>
        </div>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="input w-auto"
        >
          <option value="ALL">All Brands</option>
          {DEMO_BRANDS.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Reach",         value: formatNumber(data.totalReach),                     icon: Globe,       color: "#3D52A0", bg: "rgba(61,82,160,.10)" },
          { label: "Total Engagements",   value: formatNumber(data.totalEngagements),               icon: Heart,       color: "#7091E6", bg: "rgba(112,145,230,.10)" },
          { label: "Posts Published",     value: data.totalPostsPublished.toLocaleString(),         icon: TrendingUp,  color: "#22c55e", bg: "rgba(34,197,94,.10)" },
          { label: "Avg. Engagement Rate",value: `${data.avgEngagementRate}%`,                     icon: BarChart3,   color: "#8697C4", bg: "rgba(134,151,196,.10)" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="metric-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: '#8697C4' }}>{label}</span>
              <div className="p-2 rounded-lg" style={{ background: bg }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="card p-5 flex items-center gap-4" style={{ border: '1px solid rgba(234,179,8,.20)' }}>
        <div className="p-3 rounded-xl" style={{ background: 'rgba(234,179,8,.10)', border: '1px solid rgba(234,179,8,.20)' }}>
          <Trophy className="h-6 w-6" style={{ color: '#ca8a04' }} />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8697C4' }}>Top Performing Brand This Week</div>
          <div className="text-xl font-bold mt-0.5" style={{ color: '#3D52A0' }}>{data.topPerformingBrand}</div>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="font-bold text-base flex items-center gap-2" style={{ color: '#3D52A0' }}>
          <TrendingUp className="h-4 w-4" style={{ color: '#22c55e' }} />
          7-Day Cross-Brand Aggregate Trend
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #ADBBDA' }}>
                {['Date','Views','Followers Gained','Posts'].map((h,i) => (
                  <th key={h} className={`py-2 font-semibold ${i === 0 ? 'text-left pr-4' : i === 3 ? 'text-right pl-4' : 'text-right px-4'}`} style={{ color: '#8697C4' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.crossBrandTrend.map((day, i) => (
                <tr key={i} className="transition" style={{ borderBottom: '1px solid #EDE8F5' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#EDE8F5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td className="py-2.5 pr-4 font-medium" style={{ color: '#3D52A0' }}>{day.date}</td>
                  <td className="py-2.5 px-4 text-right font-semibold" style={{ color: '#22c55e' }}>{formatNumber(day.views)}</td>
                  <td className="py-2.5 px-4 text-right font-semibold" style={{ color: '#7091E6' }}>+{day.followers.toLocaleString()}</td>
                  <td className="py-2.5 pl-4 text-right" style={{ color: '#3D52A0' }}>{day.posts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-base flex items-center gap-2" style={{ color: '#3D52A0' }}>
          <Users className="h-4 w-4" style={{ color: '#7091E6' }} />
          Brand-Level Breakdown
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredBrands.map((brand) => {
            const trendViews = brand.trend7d.map((t) => t.views);
            const maxPlatformViews = Math.max(...brand.platformBreakdown.map((p) => p.views));
            return (
              <div key={brand.brandId} className="card p-5 space-y-4 card-hover">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base" style={{ color: '#3D52A0' }}>{brand.brandName}</h3>
                  <SparkLine points={trendViews} color="#7091E6" />
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {[
                    { label: "Total Views", value: formatNumber(brand.totalViews),  color: "#3D52A0" },
                    { label: "Followers",   value: formatNumber(brand.totalFollowers), color: "#7091E6" },
                    { label: "Eng. Rate",   value: `${brand.engagementRate}%`,      color: "#22c55e" },
                  ].map((m) => (
                    <div key={m.label} className="p-3 rounded-xl text-center" style={{ background: '#EDE8F5', border: '1px solid #ADBBDA' }}>
                      <div className="font-bold text-lg" style={{ color: m.color }}>{m.value}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: '#8697C4' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2.5">
                  {brand.platformBreakdown
                    .filter((p) => activePlatform === "ALL" || p.platform === activePlatform)
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 4)
                    .map((platform) => (
                      <div key={platform.platform} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 font-medium" style={{ color: '#3D52A0' }}>
                            <span>{PLATFORM_ICONS[platform.platform]}</span>
                            {platform.platform}
                          </span>
                          <div className="flex items-center gap-4" style={{ color: '#8697C4' }}>
                            <span><Eye className="inline h-3 w-3 mr-1" />{formatNumber(platform.views)}</span>
                            <span><Heart className="inline h-3 w-3 mr-1" />{formatNumber(platform.likes)}</span>
                            <span className="font-semibold" style={{ color: '#22c55e' }}>{platform.engagementRate}%</span>
                          </div>
                        </div>
                        <MiniBar value={platform.views} max={maxPlatformViews} color={PLATFORM_COLORS[platform.platform] ?? "#7091E6"} />
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
