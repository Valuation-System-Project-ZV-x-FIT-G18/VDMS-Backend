import { existsSync, mkdirSync } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { extname, join } from 'path';
import { randomBytes } from 'crypto';
import { StorageProvider, StoredFile, UploadInput } from './storage.types';

/**
 * Stores files on the local filesystem under <project>/uploads and serves them
 * via the static /uploads route configured in main.ts. This is the zero-config
 * default provider (STORAGE_PROVIDER=local).
 */
export class LocalStorageProvider implements StorageProvider {
  readonly name = 'local';

  // <dist>/storage -> ../../uploads  (same folder the rest of the app uses)
  private readonly uploadsDir = join(__dirname, '..', '..', 'uploads');
  private readonly publicBase =
    process.env.PUBLIC_API_BASE?.replace(/\/$/, '') || 'http://localhost:3000';

  private ensureDir(dir: string): void {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  private buildKey(input: UploadInput): string {
    const safeExt = extname(input.originalName).slice(0, 12);
    const unique = `${Date.now()}-${randomBytes(8).toString('hex')}${safeExt}`;
    return input.folder ? `${input.folder}/${unique}` : unique;
  }

  async upload(input: UploadInput): Promise<StoredFile> {
    const key = this.buildKey(input);
    const absolutePath = join(this.uploadsDir, key);
    this.ensureDir(join(absolutePath, '..'));
    await writeFile(absolutePath, input.buffer);

    return {
      url: `${this.publicBase}/uploads/${key}`,
      key,
      provider: this.name,
      size: input.buffer.length,
    };
  }

  async delete(key: string): Promise<void> {
    const absolutePath = join(this.uploadsDir, key);
    if (existsSync(absolutePath)) {
      await unlink(absolutePath);
    }
  }
}
