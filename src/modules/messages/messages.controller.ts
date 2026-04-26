import {
  Controller,
  Get,
  Post,
  Patch,
  Query,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import type { StartConversationInput, SendMessageInput } from './messages.service';
import { ChatConversation } from '../../entities/chat-conversation.entity';
import { ChatMessage } from '../../entities/chat-message.entity';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('conversations')
  async listConversations(
    @Query('userId') userId: string,
    @Query('role') role?: string,
  ): Promise<ChatConversation[]> {
    return this.messagesService.listConversations(userId, role);
  }

  @Get()
  async listMessages(
    @Query('conversationId') conversationId: string,
  ): Promise<ChatMessage[]> {
    return this.messagesService.listMessages(conversationId);
  }

  @Post('conversations')
  async startConversation(
    @Body() input: StartConversationInput,
  ): Promise<ChatConversation> {
    return this.messagesService.startConversation(input);
  }

  @Post()
  async sendMessage(@Body() input: SendMessageInput): Promise<ChatMessage> {
    return this.messagesService.sendMessage(input);
  }

  @Patch('conversations/:id/read')
  @HttpCode(200)
  async markConversationAsRead(
    @Param('id') conversationId: string,
    @Query('userId') userId: string,
  ): Promise<{ success: boolean }> {
    await this.messagesService.markConversationAsRead(conversationId, userId);
    return { success: true };
  }

  @Get('unread-count')
  async getUnreadCount(@Query('userId') userId: string): Promise<{ count: number }> {
    const count = await this.messagesService.getUnreadCount(userId);
    return { count };
  }
}
