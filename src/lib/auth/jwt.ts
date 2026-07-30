import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "drox-enterprise-jwt-secret-key-32-chars-min!"
);

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  workspaceId: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "EDITOR" | "VIEWER";
  brandId?: string;
  exp?: number;
}

export async function signJWT(payload: Omit<JWTPayload, "exp">): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET_KEY);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}
