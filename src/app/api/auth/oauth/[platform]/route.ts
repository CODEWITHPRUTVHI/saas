import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { OAUTH_PROVIDERS, buildAuthorizationUrl, isPlatformConfigured } from "@/lib/oauth";

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform.toUpperCase();
  const provider = OAUTH_PROVIDERS[platform];

  if (!provider) {
    return NextResponse.json({ error: `Unsupported platform: ${params.platform}` }, { status: 400 });
  }

  // Check if real credentials are available in .env
  if (!isPlatformConfigured(platform)) {
    return NextResponse.redirect(
      new URL(`/dashboard/accounts?error=missing_credentials&platform=${platform}`, request.url)
    );
  }

  try {
    const state = Buffer.from(JSON.stringify({ platform, timestamp: Date.now() })).toString("base64");
    const authUrl = buildAuthorizationUrl(platform, state);
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.redirect(
      new URL(`/dashboard/accounts?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
