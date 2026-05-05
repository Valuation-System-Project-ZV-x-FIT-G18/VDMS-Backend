import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('secure_share_links')
export class SecureShareLink {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() projectId!: string;
  @Column() managerId!: string;
  @Column() token!: string;
  @Column() expiresAt!: Date;
  @Column({ default: 0 }) accessCount!: number;
  @Column({ default: false }) isRevoked!: boolean;
  @CreateDateColumn() created_at!: Date;
}