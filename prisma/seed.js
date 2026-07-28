const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AI Content Distribution OS database...");

  // Clean old data if any
  await prisma.auditLog.deleteMany({});
  await prisma.aiJob.deleteMany({});
  await prisma.publishingQueueEntry.deleteMany({});
  await prisma.contentVariant.deleteMany({});
  await prisma.contentItem.deleteMany({});
  await prisma.mediaAsset.deleteMany({});
  await prisma.cloudStorageConnection.deleteMany({});
  await prisma.socialAccount.deleteMany({});
  await prisma.workspaceMembership.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.workspace.deleteMany({});
  await prisma.organization.deleteMany({});

  // 1. Create Organization & Workspace
  const org = await prisma.organization.create({
    data: {
      name: "Acme Enterprise Media",
      slug: "acme-enterprise-media",
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      organizationId: org.id,
      name: "Primary Agency Workspace",
      slug: "primary-agency",
    },
  });

  // 2. Create Admin User
  const user = await prisma.user.create({
    data: {
      email: "alex.architect@acmemedia.io",
      name: "Alex Vance (Staff Architect)",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
  });

  await prisma.workspaceMembership.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      role: "OWNER",
    },
  });

  // 3. Create Brands
  const brandTech = await prisma.brand.create({
    data: {
      workspaceId: workspace.id,
      name: "HyperGrowth Tech AI",
      brandVoiceProfile: "Futuristic, energetic, data-driven, direct, highly informative.",
      defaultHashtags: "#AI #SaaS #TechTrends #Automation",
    },
  });

  const brandLifestyle = await prisma.brand.create({
    data: {
      workspaceId: workspace.id,
      name: "Aura Modern Living",
      brandVoiceProfile: "Minimalist, serene, elegant, inspiring, polished aesthetics.",
      defaultHashtags: "#Minimalism #ModernLiving #Design #Wellness",
    },
  });

  // 4. Create Social Accounts
  await prisma.socialAccount.createMany({
    data: [
      {
        brandId: brandTech.id,
        platform: "YOUTUBE",
        accountName: "HyperGrowth Tech Channel",
        accountHandle: "@HyperGrowthAI",
        accountAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&q=80",
        accessToken: "yt_oauth_token_encrypted_991823",
        status: "ACTIVE",
      },
      {
        brandId: brandTech.id,
        platform: "INSTAGRAM",
        accountName: "HyperGrowth Official IG",
        accountHandle: "@hypergrowth.ai",
        accountAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&q=80",
        accessToken: "ig_oauth_token_encrypted_882711",
        status: "ACTIVE",
      },
      {
        brandId: brandTech.id,
        platform: "TIKTOK",
        accountName: "HyperGrowth Daily Shorts",
        accountHandle: "@hypergrowth_shorts",
        accountAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&q=80",
        accessToken: "tt_oauth_token_encrypted_119283",
        status: "ACTIVE",
      },
      {
        brandId: brandLifestyle.id,
        platform: "INSTAGRAM",
        accountName: "Aura Living Studio",
        accountHandle: "@auraliving.design",
        accountAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
        accessToken: "ig_oauth_token_encrypted_776152",
        status: "ACTIVE",
      },
    ],
  });

  // 5. Create Cloud Storage Watchers
  const driveConnection = await prisma.cloudStorageConnection.create({
    data: {
      brandId: brandTech.id,
      provider: "GOOGLE_DRIVE",
      folderName: "Drive Raw Media Ingest Folder",
      folderPath: "GoogleDrive/Acme/HyperGrowth/RawIngest",
      remoteFolderId: "gdrive_folder_1A9X0z81B",
      syncStatus: "ACTIVE",
      lastPolledAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    },
  });

  const localConnection = await prisma.cloudStorageConnection.create({
    data: {
      brandId: brandLifestyle.id,
      provider: "LOCAL_WATCHER",
      folderName: "Studio Watcher (/Volumes/Media/RawDrop)",
      folderPath: "/Volumes/Media/RawDrop",
      syncStatus: "ACTIVE",
      lastPolledAt: new Date(Date.now() - 1000 * 60 * 45),
    },
  });

  // 6. Create Media Assets and Content Items
  const asset1 = await prisma.mediaAsset.create({
    data: {
      brandId: brandTech.id,
      fileName: "ai_agent_architecture_v1.mp4",
      fileUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      fileSizeBytes: 89400000,
      mimeType: "video/mp4",
      durationSeconds: 180,
      aspectRatio: "16:9",
    },
  });

  const contentItem1 = await prisma.contentItem.create({
    data: {
      brandId: brandTech.id,
      rawMediaId: asset1.id,
      title: "Building Enterprise AI Content OS Pipelines",
      description: "Step by step breakdown of how enterprise teams use autonomous folder watchers and LLM JSON generation to publish to 7 channels.",
      status: "QUEUED",
      sourceType: "GOOGLE_DRIVE",
    },
  });

  // Create Variants
  const variantYT = await prisma.contentVariant.create({
    data: {
      contentItemId: contentItem1.id,
      platform: "YOUTUBE",
      aspectRatio: "16:9",
      derivedMediaUrl: asset1.fileUrl,
      title: "Building Enterprise AI Content OS Pipelines [2026 Blueprint]",
      caption: "Step-by-step breakdown of how enterprise teams automate multi-platform video distribution using Google Drive folder watchers and structured LLM metadata.",
      hashtags: "#AI #Automation #SystemDesign",
      tags: "ai,content os,automation,nextjs,prisma,saas",
      chaptersJson: JSON.stringify([
        { time: "00:00", label: "Introduction to AI Distribution OS" },
        { time: "02:15", label: "Folder Monitoring Architecture" },
        { time: "05:40", label: "Smart Queue & API Publishing" }
      ]),
      status: "QUEUED",
    },
  });

  const variantIG = await prisma.contentVariant.create({
    data: {
      contentItemId: contentItem1.id,
      platform: "INSTAGRAM",
      aspectRatio: "9:16",
      derivedMediaUrl: asset1.fileUrl,
      title: "Reels Cut: AI Distribution OS",
      caption: "How we turned 1 raw video into 5 platform posts automatically 🚀 Drop files in Drive -> AI generates tags & captions -> Auto-published to Instagram Reels & YouTube.",
      hashtags: "#TechReels #SaaS #Growth #Automation",
      status: "QUEUED",
    },
  });

  // Create Queue Entries
  await prisma.publishingQueueEntry.create({
    data: {
      brandId: brandTech.id,
      contentVariantId: variantYT.id,
      targetPlatform: "YOUTUBE",
      scheduledAt: new Date(Date.now() - 1000 * 60 * 30), // Due 30 min ago for instant demo publish
      status: "QUEUED",
    },
  });

  await prisma.publishingQueueEntry.create({
    data: {
      brandId: brandTech.id,
      contentVariantId: variantIG.id,
      targetPlatform: "INSTAGRAM",
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours in future
      status: "QUEUED",
    },
  });

  // 7. Seed AI Job Logs
  await prisma.aiJob.create({
    data: {
      brandId: brandTech.id,
      jobType: "SEO_METADATA",
      status: "COMPLETED",
      promptPayload: "Input transcript: 'Enterprise AI content pipeline overview with folder monitoring...'",
      outputPayload: JSON.stringify({
        youtube: { title: "Building Enterprise AI Content OS Pipelines", tags: ["ai", "saas"] },
        instagram: { caption: "How we turned 1 raw video into 5 posts", hashtags: ["#TechReels", "#SaaS"] }
      }),
      costCredits: 2,
      durationMs: 420,
    },
  });

  // 8. Log initial audit entry
  await prisma.auditLog.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      action: "WORKSPACE_INITIALIZED",
      entityType: "WORKSPACE",
      entityId: workspace.id,
      details: "Database populated with initial multi-tenant configuration and demo brands.",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
