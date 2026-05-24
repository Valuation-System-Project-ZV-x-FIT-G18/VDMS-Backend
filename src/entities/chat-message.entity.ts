import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { ChatConversation } from './chat-conversation.entity';

@Entity('chat_messages')
@Index('idx_conversation_id', { synchronize: false })
@Index('idx_sender_id', { synchronize: false })
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  conversationId!: string;

  @ManyToOne(() => ChatConversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  conversation?: ChatConversation;

  @Column({ type: 'varchar' })
  senderId!: string;

  @Column({ type: 'varchar' })
  senderName!: string;

  @Column({ type: 'varchar' })
  recipientId!: string;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'varchar', nullable: true })
  valuationJobId?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
