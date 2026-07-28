import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { OAUTH_PROVIDERS, exchangeCodeForTokens, fetchOAuthUserProfile } from "@/lib/oauth";

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const platform = params.platform.toUpperCase();

  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard/accounts?error=${encodeURIComponent(error)}&platform=${platform}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`/dashboard/accounts?error=missing_code&platform=${platform}`, request.url)
    );
  }

  const provider = OAUTH_PROVIDERS[platform];
  if (!provider) {
    return NextResponse.redirect(
      new URL(`/dashboard/accounts?error=invalid_platform`, request.url)
    );
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(platform, code);

    // 2. Fetch user profile from social platform
    const profile = await fetchOAuthUserProfile(platform, tokens.accessToken);

    // 3. Redirect back to accounts dashboard with success params
    const redirectUrl = new URL("/dashboard/accounts", request.url);
    redirectUrl.searchParams.set("connected", "1");
    redirectUrl.searchParams.set("platform", platform);
    redirectUrl.searchParams.set("name", profile.name);
    redirectUrl.searchParams.set("handle", profile.handle);
    redirectUrl.searchParams.set("followers", profile.followersCount || "0");

    return NextResponse.redirect(redirectUrl);
  } catch (err: any) {
    console.error(`OAuth callback error for ${platform}:`, err);
    return NextResponse.redirect(
      new URL(`/dashboard/accounts?error=${encodeURIComponent(err.message)}&platform=${platform}`, request.url)
    );
  }
}
