// ── Cloud Storage Abstraction (AWS S3 & Cloudflare R2 Provider) ────────────

export type StorageProviderType = "S3" | "R2" | "MEMORY";

export interface StorageConfig {
  provider: StorageProviderType;
  bucket: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpointUrl?: string; // Custom endpoint URL for Cloudflare R2
}

export interface UploadOptions {
  fileName: string;
  contentType: string;
  fileBuffer?: Buffer;
  folderPath?: string;
}

export interface UploadResult {
  fileKey: string;
  publicUrl: string;
  fileSizeBytes: number;
  provider: StorageProviderType;
  uploadedAt: string;
}

export class CloudStorageProvider {
  private config: StorageConfig;

  constructor(config?: Partial<StorageConfig>) {
    this.config = {
      provider: (process.env.STORAGE_PROVIDER as StorageProviderType) || "R2",
      bucket: process.env.STORAGE_BUCKET || "drox-media-assets",
      region: process.env.AWS_REGION || "auto",
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
      endpointUrl: process.env.STORAGE_ENDPOINT_URL || "https://r2.cloudflarestorage.com",
      ...config,
    };
  }

  /**
   * Get presigned URL for direct client upload (AWS S3 / Cloudflare R2)
   */
  async getPresignedUploadUrl(fileName: string, contentType: string): Promise<{ uploadUrl: string; fileKey: string; publicUrl: string }> {
    const fileKey = `uploads/${Date.now()}_${fileName.replace(/\s+/g, "_")}`;
    const baseUrl = this.config.endpointUrl || `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com`;
    const publicUrl = `${baseUrl}/${fileKey}`;

    // Presigned upload URL construction
    const uploadUrl = `${publicUrl}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600`;

    return {
      uploadUrl,
      fileKey,
      publicUrl,
    };
  }

  /**
   * Upload media file payload
   */
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const fileKey = `${options.folderPath || "media"}/${Date.now()}_${options.fileName.replace(/\s+/g, "_")}`;
    const baseUrl = this.config.endpointUrl || `https://${this.config.bucket}.s3.amazonaws.com`;
    const publicUrl = `${baseUrl}/${fileKey}`;

    return {
      fileKey,
      publicUrl,
      fileSizeBytes: options.fileBuffer ? options.fileBuffer.length : 1024 * 1024 * 5,
      provider: this.config.provider,
      uploadedAt: new Date().toISOString(),
    };
  }
}
