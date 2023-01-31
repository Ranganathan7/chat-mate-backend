import { Controller, Get, Body, Headers, Post, Query, Patch, Put, Param } from "@nestjs/common";
import { ConversationService } from "./conversation.service";

@Controller('chat-mate-api')

export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    @Post('create-private-conversation')
    async updatePrivateConversation(
        @Headers('id') id: string,
        @Body('userId') userId: string
    ) {
        const conversation = await this.conversationService.newPrivateConversation(id, userId, "")
        return conversation
    }

    @Post('update-conversation')
    async updateConversation(
        @Headers('id') id: string,
        @Body('conversationId') conversationId: string,
        @Body('message') message: string
    ) {
        const conversation = await this.conversationService.updateConversation(id, conversationId, message)
        return conversation 
    }

    @Get('get-conversations')
    async getConversations(
        @Headers('id') id: string
    ) {
        const conversations = await this.conversationService.getConversations(id)
        return conversations
    }

    @Get('get-conversation/:conversationId')
    async getConversation(
        @Param('conversationId') conversationId: string
    ) {
        const conversation = await this.conversationService.getConversation(conversationId)
        return conversation
    }

    @Post('create-group-conversation')
    async updateGroupConversation(
        @Headers('id') id: string,
        @Body('users') users: string[],
        @Body('conversationName') conversationName: string,
        @Body('conversationPic') conversationPic: string,
        @Body('message') message: string
    ) {
        const conversation = await this.conversationService.newGroupConversation(id, users, conversationName, conversationPic, message)
        return conversation 
    }

    @Patch('edit-group-name')
    async editGroupName(
        @Headers('id') id: string,
        @Body('conversationId') conversationId: string,
        @Body('conversationName') conversationName: string,
        @Body('message') message: string
    ) {
        return await this.conversationService.editGroupName(id, conversationId, conversationName, message)
    }

    @Patch('edit-group-pic')
    async editGroupPic(
        @Headers('id') id: string,
        @Body('conversationId') conversationId: string,
        @Body('conversationPic') conversationPic: string,
        @Body('message') message: string
    ) {
        return await this.conversationService.editGroupPic(id, conversationId, conversationPic, message)
    }

    @Patch('add-group-member')
    async addGroupMember(
        @Headers('id') id: string,
        @Body('conversationId') conversationId: string,
        @Body('user') user: string,
        @Body('message') message: string
    ) {
        return await this.conversationService.addGroupMember(id, conversationId, user, message)
    }

    @Patch('remove-group-member')
    async removeGroupMember(
        @Headers('id') id: string,
        @Body('conversationId') conversationId: string,
        @Body('userId') userId: string,
        @Body('message') message: string
    ) {
        const conversation = await this.conversationService.removeGroupMember(id, conversationId, userId, message)
        if(conversation.users.length === 0) {
            await this.conversationService.deleteGroup(conversationId)
            return { message: "Group: " + conversation.conversationName + " deleted successfully!" }
        }
        return conversation
    }

    @Post('delete-group')
    async deleteGroup(
        @Body('conversationId') conversationId: string,
        @Body('message') message: string
    ) {
        const res = await this.conversationService.deleteGroup(conversationId)
        return { message: "Group: " + res.conversationName + " deleted successfully!" }
    }
}