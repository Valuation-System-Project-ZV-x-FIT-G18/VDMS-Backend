import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * A datasheet file uploaded by a valuator against a project.
 *
 * Intentionally has NO foreign key to `projects`: uploads can originate from
 * the frontend's mock-data mode where the project id is not a real DB row, and
 * a FK would reject those inserts. `projectId` is stored as a plain identifier.
 */
@Entity('datasheets')
export class Datasheet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'project_id' })
  projectId!: string;

  /** Human project code (e.g. PRJ-2026-0001) when available. */
  @Column({ name: 'project_code', type: 'varchar', nullable: true })
  projectCode!: string | null;

  /** Original client file name. */
  @Column({ name: 'file_name' })
  fileName!: string;

  /** Publicly resolvable URL. */
  @Column({ name: 'file_url' })
  fileUrl!: string;

  /** Provider-specific key (used for deletion). */
  @Column({ name: 'storage_key' })
  storageKey!: string;

  /** Which provider stored it ("local", "s3", ...). */
  @Column({ name: 'storage_provider' })
  storageProvider!: string;

  @Column({ name: 'mime_type', type: 'varchar', nullable: true })
  mimeType!: string | null;

  @Column({ name: 'file_size', type: 'int', nullable: true })
  fileSize!: number | null;

  @Column({ name: 'uploaded_by', type: 'varchar', nullable: true })
  uploadedBy!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
