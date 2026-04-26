import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'; // TypeORM decorators for DB mapping
import { UserRole } from '../enums/user-role.enum'; // role enum

@Entity('users') // maps to "users" table in PostgreSQL
export class User {
  @PrimaryColumn({ length: 6 }) // e.g. usr001 — 6 chars
  user_id: string;

  @Column({ unique: true, length: 12 }) // NIC must be unique per user
  nic: string;

  @Column({ unique: true }) // email must be unique
  email: string;

  @Column() // hashed password stored here
  password: string;

  @Column({ type: 'enum', enum: UserRole }) // one of the 7 roles
  role: UserRole;

  @Column() // e.g. "Chaminda Prasad Senarathne"
  full_name: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column() // e.g. "C.P. Senarathne"
  name_with_initials: string;

  @Column({ type: 'date', nullable: true }) // date of birth
  date_of_birth: string;

  @Column({ length: 15 }) // phone / contact number
  phone: string;

  @Column() // e.g. "No.159, Big City Road, Rukmale"
  street_address: string;

  @Column() // e.g. "Pannipitiya"
  city: string;

  @Column() // e.g. "Colombo"
  district: string;

  @Column() // e.g. "Western"
  province: string;

  @Column({ nullable: true }) // e.g. "10230" — optional
  postal_code: string;

  @CreateDateColumn() // auto-set on insert
  registered_at: Date;
}
