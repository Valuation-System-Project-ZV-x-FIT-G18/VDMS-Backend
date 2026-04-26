import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity'; // FK to users table

@Entity('properties') // maps to "properties" table
export class Property {
  @PrimaryColumn({ length: 6 }) // e.g. prp001
  property_id: string;

  @ManyToOne(() => User) // which user this property belongs to
  @JoinColumn({ name: 'user_id' }) // FK column in properties table
  user!: User;

  @Column() // street address of property
  address: string;

  @Column() // city where property is located
  city: string;

  @Column() // Sri Lankan district
  district: string;

  @Column() // Sri Lankan province
  province: string;

  @Column() // governing local authority
  local_authority: string;

  @Column() // residential | commercial | agricultural
  land_type: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) // GPS lat
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) // GPS lng
  longitude: number;
}
