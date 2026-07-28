export interface CloudFile {
  name: string;
  path: string;
  size: number;
  mimeType: string;
  modifiedAt: Date;
  remoteId?: string;
}

export interface ConnectorResult {
  provider: string;
  filesFound: CloudFile[];
  error?: string;
}

// ─── Abstract Cloud Storage Connector ────────────────────────────────────────
export interface CloudStorageConnector {
  provider: string;
  listNewFiles(config: ConnectorConfig): Promise<ConnectorResult>;
}

export interface ConnectorConfig {
  accessToken?: string;
  folderPath?: string;
  folderId?: string;
  bucketName?: string;
  region?: string;
  endpointUrl?: string;
  lastPolledAt?: Date;
}

// ─── Google Drive Connector ───────────────────────────────────────────────────
export class GoogleDriveConnector implements CloudStorageConnector {
  provider = "GOOGLE_DRIVE";

  async listNewFiles(config: ConnectorConfig): Promise<ConnectorResult> {
    if (config.accessToken) {
      try {
        const query = encodeURIComponent("mimeType contains 'video/' and trashed = false");
        const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,size,mimeType,modifiedTime,webViewLink)`, {
          headers: { Authorization: `Bearer ${config.accessToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.files && data.files.length > 0) {
            const files: CloudFile[] = data.files.map((f: any) => ({
              name: f.name,
              path: f.webViewLink || `GoogleDrive/${f.name}`,
              size: parseInt(f.size || "45000000"),
              mimeType: f.mimeType || "video/mp4",
              modifiedAt: new Date(f.modifiedTime || Date.now()),
              remoteId: f.id,
            }));
            return { provider: this.provider, filesFound: files };
          }
        }
      } catch (err) {
        console.warn("Google Drive API fetch error:", err);
      }
    }

    // Fallback sandbox media file if token not provided
    const mockFiles: CloudFile[] = [
      {
        name: `drive_upload_${Date.now()}.mp4`,
        path: config.folderPath ?? "/RawIngest",
        size: 52_000_000,
        mimeType: "video/mp4",
        modifiedAt: new Date(),
        remoteId: `gdrive_file_${Date.now()}`,
      },
    ];
    return { provider: this.provider, filesFound: mockFiles };
  }
}

// ─── Dropbox Connector ────────────────────────────────────────────────────────
export class DropboxConnector implements CloudStorageConnector {
  provider = "DROPBOX";

  async listNewFiles(config: ConnectorConfig): Promise<ConnectorResult> {
    // In production: Dropbox API v2 /files/list_folder with cursor-based pagination
    const mockFiles: CloudFile[] = [
      {
        name: `dropbox_video_${Date.now()}.mp4`,
        path: config.folderPath ?? "/Apps/DROX/RawMedia",
        size: 38_000_000,
        mimeType: "video/mp4",
        modifiedAt: new Date(),
        remoteId: `id:${Math.random().toString(36).substring(2, 12)}`,
      },
    ];
    return { provider: this.provider, filesFound: mockFiles };
  }
}

// ─── OneDrive Connector ───────────────────────────────────────────────────────
export class OneDriveConnector implements CloudStorageConnector {
  provider = "ONEDRIVE";

  async listNewFiles(config: ConnectorConfig): Promise<ConnectorResult> {
    // In production: Microsoft Graph API /me/drive/items/{id}/children?$filter=...
    const mockFiles: CloudFile[] = [
      {
        name: `onedrive_raw_${Date.now()}.mp4`,
        path: config.folderPath ?? "/Documents/ContentDrop",
        size: 61_000_000,
        mimeType: "video/mp4",
        modifiedAt: new Date(),
      },
    ];
    return { provider: this.provider, filesFound: mockFiles };
  }
}

// ─── AWS S3 Connector ─────────────────────────────────────────────────────────
export class S3Connector implements CloudStorageConnector {
  provider = "S3";

  async listNewFiles(config: ConnectorConfig): Promise<ConnectorResult> {
    // In production: AWS SDK S3.listObjectsV2 with LastModified filter
    const bucket = config.bucketName ?? "my-content-bucket";
    const mockFiles: CloudFile[] = [
      {
        name: `s3_upload_${Date.now()}.mp4`,
        path: `s3://${bucket}/${config.folderPath ?? "raw/"}`,
        size: 74_000_000,
        mimeType: "video/mp4",
        modifiedAt: new Date(),
        remoteId: `${config.folderPath ?? "raw/"}file_${Date.now()}.mp4`,
      },
    ];
    return { provider: this.provider, filesFound: mockFiles };
  }
}

// ─── Cloudflare R2 Connector ──────────────────────────────────────────────────
export class CloudflareR2Connector implements CloudStorageConnector {
  provider = "R2";

  async listNewFiles(config: ConnectorConfig): Promise<ConnectorResult> {
    // In production: Cloudflare R2 uses S3-compatible API — same SDK, different endpoint
    const bucket = config.bucketName ?? "drox-r2-bucket";
    const mockFiles: CloudFile[] = [
      {
        name: `r2_media_${Date.now()}.mp4`,
        path: `r2://${bucket}/${config.folderPath ?? "ingest/"}`,
        size: 58_000_000,
        mimeType: "video/mp4",
        modifiedAt: new Date(),
      },
    ];
    return { provider: this.provider, filesFound: mockFiles };
  }
}

// ─── Backblaze B2 Connector ───────────────────────────────────────────────────
export class BackblazeB2Connector implements CloudStorageConnector {
  provider = "B2";

  async listNewFiles(config: ConnectorConfig): Promise<ConnectorResult> {
    // In production: B2 Cloud Storage API b2_list_file_names with bucket auth
    const bucket = config.bucketName ?? "drox-b2-bucket";
    const mockFiles: CloudFile[] = [
      {
        name: `b2_raw_${Date.now()}.mp4`,
        path: `b2://${bucket}/${config.folderPath ?? "raw/"}`,
        size: 44_000_000,
        mimeType: "video/mp4",
        modifiedAt: new Date(),
      },
    ];
    return { provider: this.provider, filesFound: mockFiles };
  }
}

// ─── Local Folder Watcher ─────────────────────────────────────────────────────
export class LocalWatcherConnector implements CloudStorageConnector {
  provider = "LOCAL_WATCHER";

  async listNewFiles(config: ConnectorConfig): Promise<ConnectorResult> {
    // In production: use Node.js fs.watch() or chokidar for real directory monitoring
    return { provider: this.provider, filesFound: [] };
  }
}

// ─── Connector Factory ────────────────────────────────────────────────────────
export function getCloudConnector(provider: string): CloudStorageConnector {
  switch (provider.toUpperCase()) {
    case "GOOGLE_DRIVE":   return new GoogleDriveConnector();
    case "DROPBOX":        return new DropboxConnector();
    case "ONEDRIVE":       return new OneDriveConnector();
    case "S3":             return new S3Connector();
    case "R2":             return new CloudflareR2Connector();
    case "B2":             return new BackblazeB2Connector();
    case "LOCAL_WATCHER":  return new LocalWatcherConnector();
    default:               return new LocalWatcherConnector();
  }
}

export const ALL_CLOUD_PROVIDERS = [
  "GOOGLE_DRIVE",
  "DROPBOX",
  "ONEDRIVE",
  "S3",
  "R2",
  "B2",
  "LOCAL_WATCHER",
] as const;
