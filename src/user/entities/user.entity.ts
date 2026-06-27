import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({ nullable: true })
  firstName: string | undefined;

  @Column({ nullable: true })
  lastName: string | undefined;

  @Column({ unique: true })
  email: string | undefined;

  @Column({ nullable: true, select: false })
  password: string | undefined;

  @Column({ nullable: true })
  role: string | undefined;

  @Column({ nullable: true })
  department: string | undefined;

  @Column({ default: 'active' })
  status: string | undefined;

  @Column({ nullable: true })
  photo: string | undefined;

  @Column({ nullable: true })
  phone: string | undefined;

  @Column({ nullable: true })
  googleId: string | undefined;

  @Column({ nullable: true, select: false })
  resetToken: string | undefined;

  @CreateDateColumn()
  createdAt: Date | undefined;
}