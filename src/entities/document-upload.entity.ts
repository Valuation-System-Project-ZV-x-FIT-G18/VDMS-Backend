import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('document_uploads')
export class DocumentUpload {
  @PrimaryColumn({ length: 6 })
  document_id?: string;

  @Column({ nullable: true })
  nic_file_name?: string;
  @Column({ nullable: true })
  nic_file_path?: string;

  @Column({ nullable: true })
  tax_file_name?: string;
  @Column({ nullable: true })
  tax_file_path?: string;

  @Column({ nullable: true })
  utility_file_name?: string;
  @Column({ nullable: true })
  utility_file_path?: string;

  @Column({ nullable: true })
  other_file_name?: string;
  @Column({ nullable: true })
  other_file_path?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at?: Date;
}
