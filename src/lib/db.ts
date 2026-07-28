import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Helper to ensure tenant scoping by workspaceId and brandId
export function withBrandScope(brandId: string) {
  return {
    brandId,
  };
}

export function withWorkspaceScope(workspaceId: string) {
  return {
    workspaceId,
  };
}
