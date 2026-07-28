// ─── Video Repurposer (FFmpeg Pipeline) ──────────────────────────────────────
// Generates aspect ratio conversion commands for platform-optimized cuts

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";

export interface RepurposeJob {
  sourceMediaUrl: string;
  targetAspectRatio: AspectRatio;
  targetPlatform: string;
  inputWidth?: number;
  inputHeight?: number;
  outputUrl?: string;
  smartCropMode?: "center" | "face" | "auto";
}

export interface FfmpegCommand {
  command: string;
  args: string[];
  expectedOutputPath: string;
  estimatedDurationMs: number;
}

export interface RepurposeResult {
  aspectRatio: AspectRatio;
  targetPlatform: string;
  outputUrl: string;
  ffmpegCommand: string;
  estimatedDurationMs: number;
  status: "COMPLETED" | "FAILED";
  errorLog?: string;
}

// ─── FFmpeg Command Generator ─────────────────────────────────────────────────
export function buildFfmpegCommand(job: RepurposeJob): FfmpegCommand {
  const outputPath = `/tmp/repurposed_${job.targetPlatform.toLowerCase()}_${Date.now()}.mp4`;
  const { sourceMediaUrl, targetAspectRatio, smartCropMode = "center" } = job;

  // Dimension targets per aspect ratio
  const dimensionMap: Record<AspectRatio, { width: number; height: number }> = {
    "16:9": { width: 1920, height: 1080 },
    "9:16": { width: 1080, height: 1920 },
    "1:1":  { width: 1080, height: 1080 },
    "4:5":  { width: 1080, height: 1350 },
  };

  const { width, height } = dimensionMap[targetAspectRatio];

  // Smart crop filter selection
  // In production: for face-tracking use dlib/OpenCV preprocessing step before FFmpeg
  let cropFilter = "";
  if (smartCropMode === "face") {
    // Face-detected crop — requires pre-computed bbox fed in as x/y offsets
    cropFilter = `scale=${width * 2}:${height * 2},smartcrop=${width}:${height}`;
  } else if (smartCropMode === "center") {
    // Center crop: scale to cover, then crop center region
    const scaleFilter = targetAspectRatio === "9:16"
      ? `scale=iw*${height}/ih:${height}`
      : `scale=${width}:ih*${width}/iw`;
    cropFilter = `${scaleFilter},crop=${width}:${height}:(iw-${width})/2:(ih-${height})/2`;
  } else {
    // Auto: use FFmpeg's built-in fill+crop with padding fallback
    cropFilter = `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}`;
  }

  // Full FFmpeg command
  const args = [
    "-i", sourceMediaUrl,
    "-vf", `${cropFilter},setsar=1`,
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "22",
    "-c:a", "aac",
    "-b:a", "128k",
    "-movflags", "+faststart",
    "-y",
    outputPath,
  ];

  const command = `ffmpeg ${args.join(" ")}`;

  return {
    command,
    args,
    expectedOutputPath: outputPath,
    estimatedDurationMs: 3000 + Math.random() * 5000,
  };
}

// ─── Platform Repurpose Matrix ────────────────────────────────────────────────
// Defines which aspect ratios to generate for each target platform
export const PLATFORM_ASPECT_RATIO_MAP: Record<string, AspectRatio[]> = {
  YOUTUBE:         ["16:9"],
  YOUTUBE_SHORTS:  ["9:16"],
  INSTAGRAM:       ["9:16", "1:1"],
  INSTAGRAM_STORY: ["9:16"],
  TIKTOK:          ["9:16"],
  FACEBOOK:        ["16:9", "1:1"],
  LINKEDIN:        ["16:9", "1:1"],
  PINTEREST:       ["9:16", "4:5"],
  TWITTER:         ["16:9"],
};

// ─── Main Repurpose Executor ──────────────────────────────────────────────────
export async function repurposeVideo(jobs: RepurposeJob[]): Promise<RepurposeResult[]> {
  const results: RepurposeResult[] = [];

  for (const job of jobs) {
    try {
      const ffmpegCmd = buildFfmpegCommand(job);

      // In production: spawn FFmpeg child process in a containerized worker
      // For now: simulate processing time and return a mock output URL
      await new Promise((res) => setTimeout(res, 200)); // Simulate brief processing

      const outputUrl = job.outputUrl ??
        `https://media.drox.io/repurposed/${job.targetPlatform.toLowerCase()}/${job.targetAspectRatio.replace(":", "x")}_${Date.now()}.mp4`;

      results.push({
        aspectRatio: job.targetAspectRatio,
        targetPlatform: job.targetPlatform,
        outputUrl,
        ffmpegCommand: ffmpegCmd.command,
        estimatedDurationMs: ffmpegCmd.estimatedDurationMs,
        status: "COMPLETED",
      });
    } catch (err: any) {
      results.push({
        aspectRatio: job.targetAspectRatio,
        targetPlatform: job.targetPlatform,
        outputUrl: "",
        ffmpegCommand: "",
        estimatedDurationMs: 0,
        status: "FAILED",
        errorLog: err.message,
      });
    }
  }

  return results;
}

// ─── Helper: Generate All Cuts For A Platform ────────────────────────────────
export async function generateAllPlatformCuts(
  sourceUrl: string,
  targetPlatforms: string[],
  smartCropMode: RepurposeJob["smartCropMode"] = "center"
): Promise<RepurposeResult[]> {
  const jobs: RepurposeJob[] = [];

  for (const platform of targetPlatforms) {
    const ratios = PLATFORM_ASPECT_RATIO_MAP[platform] ?? ["16:9"];
    for (const ratio of ratios) {
      jobs.push({
        sourceMediaUrl: sourceUrl,
        targetAspectRatio: ratio,
        targetPlatform: platform,
        smartCropMode,
      });
    }
  }

  return repurposeVideo(jobs);
}
