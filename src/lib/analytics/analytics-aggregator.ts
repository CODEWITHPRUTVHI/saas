// ─── Analytics Data Aggregator ────────────────────────────────────────────────
// Generates multi-brand, multi-platform analytics snapshots for dashboards
// In production: replace with real platform API data pulls (YouTube Analytics API,
// Instagram Graph Insights, TikTok Analytics API, LinkedIn Analytics API, etc.)

export interface BrandAnalytics {
  brandId: string;
  brandName: string;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalFollowers: number;
  followersGained: number;
  engagementRate: number;
  reachEstimate: number;
  platformBreakdown: PlatformAnalytics[];
  trend7d: TrendPoint[];
}

export interface PlatformAnalytics {
  platform: string;
  postsPublished: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  engagementRate: number;
}

export interface TrendPoint {
  date: string; // YYYY-MM-DD
  views: number;
  followers: number;
  posts: number;
}

export interface WorkspaceAnalyticsSummary {
  totalBrands: number;
  totalPostsPublished: number;
  totalReach: number;
  totalEngagements: number;
  avgEngagementRate: number;
  topPerformingBrand: string;
  brands: BrandAnalytics[];
  crossBrandTrend: TrendPoint[];
}

// ─── Deterministic Mock Analytics Generator ───────────────────────────────────
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generatePlatformAnalytics(brandSeed: number, platform: string, platformIndex: number): PlatformAnalytics {
  const base = seededRandom(brandSeed + platformIndex * 31) * 100000;
  const views = Math.round(base * (1 + seededRandom(brandSeed + platformIndex) * 3));
  const likes = Math.round(views * (0.02 + seededRandom(brandSeed + platformIndex * 7) * 0.08));
  const comments = Math.round(likes * (0.05 + seededRandom(brandSeed + platformIndex * 13) * 0.1));
  const shares = Math.round(likes * (0.02 + seededRandom(brandSeed + platformIndex * 17) * 0.05));
  const followers = Math.round(5000 + seededRandom(brandSeed + platformIndex * 19) * 95000);
  const engagementRate = Math.round(((likes + comments + shares) / Math.max(views, 1)) * 100 * 10) / 10;

  return {
    platform,
    postsPublished: Math.round(1 + seededRandom(brandSeed + platformIndex * 23) * 20),
    views,
    likes,
    comments,
    shares,
    followers,
    engagementRate,
  };
}

function generateTrend7d(brandSeed: number): TrendPoint[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const daySeed = brandSeed + i * 41;
    return {
      date: date.toISOString().split("T")[0],
      views: Math.round(1000 + seededRandom(daySeed) * 15000),
      followers: Math.round(seededRandom(daySeed + 7) * 200),
      posts: Math.round(seededRandom(daySeed + 13) * 5),
    };
  });
}

// ─── Main Aggregator ──────────────────────────────────────────────────────────
export async function aggregateWorkspaceAnalytics(
  brands: Array<{ id: string; name: string }>,
  platforms: string[] = ["YOUTUBE", "INSTAGRAM", "TIKTOK", "FACEBOOK", "LINKEDIN"]
): Promise<WorkspaceAnalyticsSummary> {
  const brandAnalytics: BrandAnalytics[] = brands.map((brand, brandIdx) => {
    const brandSeed = brand.id.charCodeAt(0) * 100 + brandIdx * 997;
    const platformBreakdown = platforms.map((p, pi) => generatePlatformAnalytics(brandSeed, p, pi));

    const totalViews = platformBreakdown.reduce((s, p) => s + p.views, 0);
    const totalLikes = platformBreakdown.reduce((s, p) => s + p.likes, 0);
    const totalComments = platformBreakdown.reduce((s, p) => s + p.comments, 0);
    const totalShares = platformBreakdown.reduce((s, p) => s + p.shares, 0);
    const totalFollowers = platformBreakdown.reduce((s, p) => s + p.followers, 0);
    const followersGained = Math.round(seededRandom(brandSeed + 71) * 2000);
    const totalPosts = platformBreakdown.reduce((s, p) => s + p.postsPublished, 0);
    const engagementRate = Math.round(((totalLikes + totalComments + totalShares) / Math.max(totalViews, 1)) * 100 * 10) / 10;
    const reachEstimate = Math.round(totalViews * (1.2 + seededRandom(brandSeed + 83) * 0.8));

    return {
      brandId: brand.id,
      brandName: brand.name,
      totalPosts,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      totalFollowers,
      followersGained,
      engagementRate,
      reachEstimate,
      platformBreakdown,
      trend7d: generateTrend7d(brandSeed),
    };
  });

  // Cross-brand aggregate trend
  const crossBrandTrend = brandAnalytics[0]?.trend7d.map((point, i) => ({
    date: point.date,
    views: brandAnalytics.reduce((sum, b) => sum + b.trend7d[i].views, 0),
    followers: brandAnalytics.reduce((sum, b) => sum + b.trend7d[i].followers, 0),
    posts: brandAnalytics.reduce((sum, b) => sum + b.trend7d[i].posts, 0),
  })) ?? [];

  const topBrand = [...brandAnalytics].sort((a, b) => b.totalViews - a.totalViews)[0];

  return {
    totalBrands: brands.length,
    totalPostsPublished: brandAnalytics.reduce((s, b) => s + b.totalPosts, 0),
    totalReach: brandAnalytics.reduce((s, b) => s + b.reachEstimate, 0),
    totalEngagements: brandAnalytics.reduce((s, b) => s + b.totalLikes + b.totalComments + b.totalShares, 0),
    avgEngagementRate: Math.round((brandAnalytics.reduce((s, b) => s + b.engagementRate, 0) / Math.max(brands.length, 1)) * 10) / 10,
    topPerformingBrand: topBrand?.brandName ?? "—",
    brands: brandAnalytics,
    crossBrandTrend,
  };
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
