import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConversationService } from "src/conversation/conversation.service";
import { Chat, ChatType } from "src/schemas/chat.schema";
import { Conversation, ConversationType } from "src/schemas/converstaion.schema";
import { User, UserType } from "src/schemas/user.schema";

@Injectable()

export class ChatService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserType>,
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatType>,
        @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationType>,
        ) {}

    async createChat(content: string, author: string, conversation: ConversationType): Promise<ChatType> {
        const chat = {
            content: content,
            author: author,
            conversation: conversation
        }
        const createdChat = await this.chatModel.create(chat)
        return createdChat
    }

    async getChats(conversationId: string): Promise<ChatType[]> {
        const chats = await this.chatModel.find({conversation: conversationId}).populate("author", "-password").sort({updatedAt: 1})                        
        return chats;
    }

}

