import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalStorageProvider } from './local-storage.provider';
import { StorageProvider, StoredFile, UploadInput } from './storage.types';

/**
 * Selects and delegates to the configured blob-storage provider.
 *
 * STORAGE_PROVIDER picks the implementation. Only "local" ships today; the
 * switch is the single place to register cloud providers (S3 / Azure / Vercel)
 * once their adapters + SDKs are added — the rest of the app talks to this
 * service and never to a concrete provider.
 */
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private provider!: StorageProvider;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const selected = (
      this.config.get<string>('STORAGE_PROVIDER') ?? 'local'
    ).toLowerCase();

    switch (selected) {
      case 'local':
        this.provider = new LocalStorageProvider();
        break;
      // Future providers plug in here, e.g.:
      //   case 's3':     this.provider = new S3StorageProvider(this.config); break;
      //   case 'azure':  this.provider = new AzureStorageProvider(this.config); break;
      //   case 'vercel': this.provider = new VercelBlobProvider(this.config); break;
      default:
        this.logger.warn(
          `Unknown STORAGE_PROVIDER "${selected}", falling back to local disk.`,
        );
        this.provider = new LocalStorageProvider();
    }

    this.logger.log(`Blob storage provider: ${this.provider.name}`);
  }

  upload(input: UploadInput): Promise<StoredFile> {
    return this.provider.upload(input);
  }

  delete(key: string): Promise<void> {
    return this.provider.delete(key);
  }

  get activeProvider(): string {
    return this.provider.name;
  }
}
