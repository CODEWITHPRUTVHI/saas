import { db } from "../db";
import { generateSeoMetadata } from "../ai/seo-generator";
import { addHours } from "date-fns";

export interface ScanFolderResult {
  connectionId: string;
  brandId: string;
  filesScanned: number;
  newItemsCreated: number;
  aiJobsTriggered: number;
  queueEntriesAdded: number;
  details: string[];
}

/**
 * Scans a connected cloud folder / watcher for new raw media files,
 * automatically generates AI metadata, creates platform cuts (variants),
 * and places them into the Smart Publishing Queue.
 */
export async function processFolderScan(connectionId: string): Promise<ScanFolderResult> {
  const connection = await db.cloudStorageConnection.findUnique({
    where: { id: connectionId },
    include: {
      brand: true,
    },
  });

  if (!connection) {
    throw new Error(`Cloud storage connection with ID ${connectionId} not found.`);
  }

  const brand = connection.brand;
  const now = new Date();

  // Simulated files detected in monitored cloud storage folder
  const sampleMediaFiles = [
    {
      name: `master_product_demo_${Date.now().toString().slice(-4)}.mp4`,
      url: `https://storage.cloud-os.io/brands/${brand.id}/raw/${Date.now()}.mp4`,
      sizeBytes: 45200000,
      mimeType: "video/mp4",
      durationSeconds: 145,
      transcript: "Welcome to our platform overview. Today we demonstrate how automated content distribution saves over 20 hours per week for agencies by monitoring cloud folders and leveraging AI for metadata.",
    },
  ];

  let newItemsCreated = 0;
  let aiJobsTriggered = 0;
  let queueEntriesAdded = 0;
  const details: string[] = [];

  for (const file of sampleMediaFiles) {
    // 1. Create Media Asset in DAM
    const mediaAsset = await db.mediaAsset.create({
      data: {
        brandId: brand.id,
        fileName: file.name,
        fileUrl: file.url,
        fileSizeBytes: file.sizeBytes,
        mimeType: file.mimeType,
        durationSeconds: file.durationSeconds,
        aspectRatio: "16:9",
        checksum: `sha256-${Math.random().toString(36).substring(2, 10)}`,
      },
    });

    // 2. Create Master ContentItem
    const contentItem = await db.contentItem.create({
      data: {
        brandId: brand.id,
        rawMediaId: mediaAsset.id,
        title: `Auto-Ingested: ${file.name}`,
        description: file.transcript,
        status: "PROCESSING",
        sourceType: connection.provider,
      },
    });
    newItemsCreated++;

    // 3. Trigger AI SEO Job
    const startTime = Date.now();
    const seoOutput = await generateSeoMetadata({
      transcriptOrDescription: file.transcript,
      brandVoiceProfile: brand.brandVoiceProfile || undefined,
      defaultHashtags: brand.defaultHashtags || undefined,
    });
    const durationMs = Date.now() - startTime;

    const aiJob = await db.aiJob.create({
      data: {
        brandId: brand.id,
        jobType: "SEO_METADATA",
        status: "COMPLETED",
        promptPayload: JSON.stringify({ transcript: file.transcript, brandVoice: brand.brandVoiceProfile }),
        outputPayload: JSON.stringify(seoOutput),
        costCredits: 2,
        durationMs,
      },
    });
    aiJobsTriggered++;

    // 4. Create Platform Variants (YouTube 16:9 / Shorts cut, Instagram 9:16 Reel, TikTok 9:16)
    const targetPlatforms = ["YOUTUBE", "INSTAGRAM", "TIKTOK"];

    for (let i = 0; i < targetPlatforms.length; i++) {
      const platform = targetPlatforms[i];
      let title = contentItem.title;
      let caption = file.transcript;
      let hashtags = brand.defaultHashtags || "";
      let tags = "";
      let chaptersJson = "";

      if (platform === "YOUTUBE") {
        title = seoOutput.youtube.title;
        caption = seoOutput.youtube.description;
        tags = seoOutput.youtube.tags.join(",");
        chaptersJson = JSON.stringify(seoOutput.youtube.chapters);
      } else if (platform === "INSTAGRAM") {
        title = "Instagram Reel Cut";
        caption = seoOutput.instagram.caption;
        hashtags = seoOutput.instagram.hashtags.join(" ");
      } else if (platform === "TIKTOK") {
        title = "TikTok Vertical Cut";
        caption = seoOutput.tiktok.caption;
        hashtags = seoOutput.tiktok.keywords.map(k => `#${k}`).join(" ");
      }

      const variant = await db.contentVariant.create({
        data: {
          contentItemId: contentItem.id,
          platform,
          aspectRatio: platform === "YOUTUBE" ? "16:9" : "9:16",
          derivedMediaUrl: mediaAsset.fileUrl,
          title,
          caption,
          hashtags,
          tags,
          chaptersJson,
          status: "QUEUED",
        },
      });

      // 5. Calculate Smart Queue Scheduled Time (e.g. staggered 3 hours apart)
      const scheduledTime = addHours(now, (i + 1) * 3);

      await db.publishingQueueEntry.create({
        data: {
          brandId: brand.id,
          contentVariantId: variant.id,
          targetPlatform: platform,
          scheduledAt: scheduledTime,
          status: "QUEUED",
          retryCount: 0,
        },
      });
      queueEntriesAdded++;
    }

    // Update Master ContentItem status
    await db.contentItem.update({
      where: { id: contentItem.id },
      data: { status: "QUEUED" },
    });

    details.push(`Ingested file ${file.name} -> ContentItem ${contentItem.id} -> 3 Variants Queued.`);
  }

  // Update last polled timestamp
  await db.cloudStorageConnection.update({
    where: { id: connectionId },
    data: {
      lastPolledAt: now,
      syncStatus: "ACTIVE",
    },
  });

  return {
    connectionId,
    brandId: brand.id,
    filesScanned: sampleMediaFiles.length,
    newItemsCreated,
    aiJobsTriggered,
    queueEntriesAdded,
    details,
  };
}
