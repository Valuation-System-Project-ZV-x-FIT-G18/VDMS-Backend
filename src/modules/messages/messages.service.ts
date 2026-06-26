import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ChatConversation } from '../../entities/chat-conversation.entity';
import { ChatMessage } from '../../entities/chat-message.entity';

export interface StartConversationInput {
  userId: string;
  userName: string;
  userRole?: string;
  otherUserId: string;
  otherUserName: string;
  otherUserRole?: string;
  valuationJobId?: string;
}

export interface SendMessageInput {
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  valuationJobId?: string;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(ChatConversation)
    private conversationRepo: Repository<ChatConversation>,
    @InjectRepository(ChatMessage)
    private messageRepo: Repository<ChatMessage>,
  ) {}

  async listConversations(
    userId: string,
    role?: string,
  ): Promise<ChatConversation[]> {
    // Get all conversations and filter in memory to handle array column queries
    try {
      const all = await this.conversationRepo.find({
        order: { updatedAt: 'DESC' },
      });

      // Return only conversations where this exact user ID is a participant.
      return all.filter((c) => c.participantIds?.includes(userId));
    } catch (error) {
      console.error('Error listing conversations:', error);
      return [];
    }
  }

  async listMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      return await this.messageRepo.find({
        where: { conversationId },
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      console.error('Error listing messages:', error);
      return [];
    }
  }

  async startConversation(
    input: StartConversationInput,
  ): Promise<ChatConversation> {
    try {
      // Find existing conversation with both participants
      const all = await this.conversationRepo.find();
      const existing = all.find((c) => {
        const hasBoth =
          c.participantIds?.includes(input.userId) &&
          c.participantIds?.includes(input.otherUserId);
        const sameJob =
          input.valuationJobId === undefined ||
          c.valuationJobId === input.valuationJobId;
        return hasBoth && sameJob;
      });

      if (existing) {
        return existing;
      }

      // Create new conversation with proper UUID
      const conversation = this.conversationRepo.create({
        id: uuid(), // Generate proper UUID
        participantIds: [input.userId, input.otherUserId],
        participantNames: {
          [input.userId]: input.userName,
          [input.otherUserId]: input.otherUserName,
        },
        participantRoles: {
          [input.userId]: input.userRole || 'user',
          [input.otherUserId]: input.otherUserRole || 'user',
        },
        valuationJobId: input.valuationJobId,
        lastMessage: '',
        unreadBy: {
          [input.userId]: 0,
          [input.otherUserId]: 0,
        },
      });

      return this.conversationRepo.save(conversation);
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }

  async sendMessage(input: SendMessageInput): Promise<ChatMessage> {
    try {
      // Create message with proper UUID
      const message = this.messageRepo.create({
        id: uuid(), // Generate proper UUID
        conversationId: input.conversationId,
        senderId: input.senderId,
        senderName: input.senderName,
        recipientId: input.recipientId,
        text: input.text,
        valuationJobId: input.valuationJobId,
      });

      const savedMessage = await this.messageRepo.save(message);

      // Update conversation's lastMessage and mark as unread for recipient
      const conversation = await this.conversationRepo.findOne({
        where: { id: input.conversationId },
      });

      if (conversation) {
        conversation.lastMessage = input.text;
        conversation.unreadBy = {
          ...(conversation.unreadBy || {}),
          [input.recipientId]: (conversation.unreadBy?.[input.recipientId] || 0) + 1,
        };
        conversation.updatedAt = new Date();
        await this.conversationRepo.save(conversation);
      }

      return savedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async markConversationAsRead(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    try {
      const conversation = await this.conversationRepo.findOne({
        where: { id: conversationId },
      });

      if (conversation) {
        if (!conversation.unreadBy) {
          conversation.unreadBy = {};
        }
        conversation.unreadBy[userId] = 0;
        await this.conversationRepo.save(conversation);
      }
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const conversations = await this.listConversations(userId);
      return conversations.reduce((sum, conv) => {
        return sum + (conv.unreadBy?.[userId] || 0);
      }, 0);
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}
