import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_conversations')
@Index('idx_participant_ids', { synchronize: false })
@Index('idx_valuation_job_id', { synchronize: false })
export class ChatConversation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { array: true })
  participantIds!: string[];

  @Column('json')
  participantNames!: Record<string, string>;

  @Column('json')
  participantRoles!: Record<string, string>;

  @Column({ type: 'varchar', nullable: true })
  valuationJobId?: string;

  @Column({ type: 'text', nullable: true })
  lastMessage?: string;

  @Column('json', { default: {} })
  unreadBy!: Record<string, number>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ChatMessage, (message) => message.conversation, {
    cascade: true,
    eager: false,
  })
  messages?: ChatMessage[];
}
