/**
 * Pluggable blob-storage abstraction.
 *
 * A single StorageProvider interface is implemented per backend (local disk now;
 * AWS S3 / Azure Blob / Vercel Blob can be added later as additional providers).
 * The active provider is selected at runtime via the STORAGE_PROVIDER env var.
 */

export interface UploadInput {
  /** Raw file bytes (from multer memoryStorage). */
  buffer: Buffer;
  /** Original client file name, e.g. "datasheet.pdf". */
  originalName: string;
  /** MIME type, e.g. "application/pdf". */
  mimeType?: string;
  /** Logical folder/prefix within the bucket, e.g. "datasheets". */
  folder?: string;
}

export interface StoredFile {
  /** Publicly resolvable URL to fetch the file. */
  url: string;
  /** Provider-specific key/path used to locate (and later delete) the file. */
  key: string;
  /** Identifier of the provider that stored it ("local" | "s3" | "azure" | ...). */
  provider: string;
  /** Stored byte size. */
  size: number;
}

export interface StorageProvider {
  /** Provider identifier, surfaced on StoredFile.provider. */
  readonly name: string;
  /** Persist a file and return its public URL + key. */
  upload(input: UploadInput): Promise<StoredFile>;
  /** Remove a previously stored file by its key. */
  delete(key: string): Promise<void>;
}
