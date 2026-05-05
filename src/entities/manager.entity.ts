import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ManagerRole { L1 = 'L1', L2 = 'L2', L3 = 'L3' }

@Entity('managers')
export class Manager {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() name!: string;
  @Column({ unique: true }) email!: string;
  @Column() password!: string;
  @Column({ type: 'enum', enum: ManagerRole }) role!: ManagerRole;
  @Column({ nullable: true }) phone!: string;
  @Column({ nullable: true }) avatar!: string;
  @Column({ default: true }) isActive!: boolean;
  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}