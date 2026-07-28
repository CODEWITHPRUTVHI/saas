// ─── Thumbnail Frame Scorer ───────────────────────────────────────────────────
// Section 6.3 contract: Frame extraction → scoring → ranked list with justifications

export interface FrameCandidate {
  timestampSeconds: number;
  timestampDisplay: string; // MM:SS
  sharpnessScore: number;   // 0-100
  contrastScore: number;    // 0-100
  brightnessScore: number;  // 0-100 (penalize overexposed/underexposed)
  facePresenceScore: number;// 0-100 (0 = no face, 100 = ideal centered face)
  compositeScore: number;   // weighted average
  justification: string;
  thumbnailUrl: string;
  suggestedTextOverlay: string;
}

export interface ThumbnailGenerationResult {
  rankedCandidates: FrameCandidate[];
  selectedThumbnailTimestamp: number;
  selectedThumbnailUrl: string;
  suggestedTextOverlay: string;
}

function secondsToDisplay(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Simulate heuristic frame scoring
// In production: replace with actual FFmpeg frame extraction + CV/ML scoring pipeline
function scoreFrame(timestamp: number, durationSeconds: number): Omit<FrameCandidate, "thumbnailUrl" | "suggestedTextOverlay" | "justification"> {
  const relativePosition = timestamp / durationSeconds;

  // Heuristics:
  // - Avoid first and last 5% of video (usually intros/outros — lower quality)
  // - Mid-video frames tend to have peak action
  // - Simulate sharpness variance
  const isEdgeFrame = relativePosition < 0.05 || relativePosition > 0.95;
  const isMidVideo = relativePosition > 0.2 && relativePosition < 0.8;

  const sharpnessScore = isEdgeFrame ? 30 + Math.random() * 20 : 60 + Math.random() * 35;
  const contrastScore = isMidVideo ? 65 + Math.random() * 30 : 40 + Math.random() * 25;
  const brightnessScore = 55 + Math.random() * 35;
  const facePresenceScore = isMidVideo ? Math.random() * 80 : Math.random() * 40;

  const compositeScore = Math.round(
    sharpnessScore * 0.35 +
    contrastScore * 0.25 +
    brightnessScore * 0.15 +
    facePresenceScore * 0.25
  );

  return {
    timestampSeconds: timestamp,
    timestampDisplay: secondsToDisplay(timestamp),
    sharpnessScore: Math.round(sharpnessScore),
    contrastScore: Math.round(contrastScore),
    brightnessScore: Math.round(brightnessScore),
    facePresenceScore: Math.round(facePresenceScore),
    compositeScore,
  };
}

function buildJustification(frame: Omit<FrameCandidate, "thumbnailUrl" | "suggestedTextOverlay" | "justification">): string {
  const parts: string[] = [];
  if (frame.sharpnessScore > 75) parts.push("high sharpness");
  else if (frame.sharpnessScore < 45) parts.push("lower sharpness — possible motion blur");
  if (frame.contrastScore > 70) parts.push("strong visual contrast");
  if (frame.facePresenceScore > 60) parts.push("face/subject detected in frame");
  if (frame.facePresenceScore < 20) parts.push("no prominent subject detected");
  if (frame.compositeScore > 80) parts.push("excellent overall frame quality");
  return parts.length > 0 ? `Ranked by: ${parts.join(", ")}.` : "Average frame quality.";
}

// ─── Main Thumbnail Generator ─────────────────────────────────────────────────
export async function generateThumbnailCandidates(
  mediaUrl: string,
  durationSeconds: number = 180,
  candidateCount: number = 8,
  contentTitle: string = "",
  brandName: string = ""
): Promise<ThumbnailGenerationResult> {
  // Generate N evenly-distributed candidate timestamps (excluding edges)
  const usableDuration = durationSeconds * 0.9;
  const startOffset = durationSeconds * 0.05;
  const interval = usableDuration / candidateCount;

  const rawCandidates = Array.from({ length: candidateCount }, (_, i) => {
    const timestamp = startOffset + i * interval + Math.random() * interval * 0.3;
    return scoreFrame(Math.round(timestamp * 10) / 10, durationSeconds);
  });

  // Sort by composite score descending
  rawCandidates.sort((a, b) => b.compositeScore - a.compositeScore);

  // Build full candidates with justification and mock thumbnail URLs
  const rankedCandidates: FrameCandidate[] = rawCandidates.map((frame, rank) => {
    const justification = buildJustification(frame);

    // In production: FFmpeg `ss` seek thumbnails uploaded to object storage
    const thumbnailUrl = `https://storage.drox.io/thumbnails/frame_${Math.round(frame.timestampSeconds)}s_${Date.now()}.jpg`;

    // Suggested text overlay based on rank and content
    let suggestedTextOverlay = "";
    if (rank === 0) {
      const shortTitle = contentTitle.split(":")[0].trim().slice(0, 30);
      suggestedTextOverlay = shortTitle || `${brandName} | Watch This`;
    } else if (rank === 1) {
      suggestedTextOverlay = "How It Works →";
    } else {
      suggestedTextOverlay = "";
    }

    return { ...frame, justification, thumbnailUrl, suggestedTextOverlay };
  });

  const selected = rankedCandidates[0];

  return {
    rankedCandidates,
    selectedThumbnailTimestamp: selected.timestampSeconds,
    selectedThumbnailUrl: selected.thumbnailUrl,
    suggestedTextOverlay: selected.suggestedTextOverlay,
  };
}
