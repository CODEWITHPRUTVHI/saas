import { NextResponse } from "next/server";
import { signJWT } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Email and password (min 6 chars) are required." },
        { status: 400 }
      );
    }

    // Generate JWT payload for user
    const userPayload = {
      userId: `usr_${Date.now()}`,
      email,
      name: email.split("@")[0],
      workspaceId: "ws_acme_enterprise",
      role: "ADMIN" as const,
    };

    const token = await signJWT(userPayload);

    const response = NextResponse.json({
      success: true,
      user: {
        ...userPayload,
        plan: "enterprise",
        brandName: "HyperGrowth Tech AI",
      },
      token,
    });

    // Set HTTP-only cookie
    response.cookies.set("drox_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Authentication failed." },
      { status: 500 }
    );
  }
}
