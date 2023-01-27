import { Controller, Get, Body, Headers, Post, Query, Patch, Put, Param } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('chat-mate-api')

export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('get-chats/:conversationId')
    async getChats(
        @Headers('id') id: string,
        @Param('conversationId') conversationId: string
    ) {
        if(conversationId) {
            return await this.chatService.getChats(conversationId)
        }
        else return { message: "Missing the conversation ID parameter" }
    }
}