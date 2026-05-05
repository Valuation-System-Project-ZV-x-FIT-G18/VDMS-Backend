import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bottlenecks')
export class Bottleneck {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() projectId!: string;
  @Column() propertyAddress!: string;
  @Column() issueType!: string;
  @Column({ default: 0 }) dayStuck!: number;
  @Column() stage!: string;
  @Column() client!: string;
  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}