import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatService } from "src/chat/chat.service";
import { Chat, ChatType } from "src/schemas/chat.schema";
import { Conversation, ConversationType } from "src/schemas/converstaion.schema";
import { User, UserType } from "src/schemas/user.schema";

@Injectable()

export class ConversationService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserType>,
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatType>,
        @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationType>,
        private readonly chatService: ChatService
        ) {}

    async newPrivateConversation(sender: string, receiver: string, message: string): Promise<ConversationType> {
        const existingConversation = await this.conversationModel.findOne(
            { 
                 $and: [
                    {users: {$elemMatch: {$eq: sender}}},
                    {users: {$elemMatch: {$eq: receiver}}},
                    {conversationName: ""}
                 ]
            }).populate("users", "-password").populate("admins", "-password").populate("latestMessager", "-password")

        if(existingConversation) return existingConversation

        const conversation = {
            users: [sender, receiver],
            admins: [sender, receiver],
            latestMessage: message,
            latestMessager: sender
        }
        const createdConversation = await this.conversationModel.create(conversation)
        await createdConversation.populate("users", "-password")
        await createdConversation.populate("admins", "-password")
        await createdConversation.populate("latestMessager", "-password")
        const chat = await this.chatService.createChat(message, sender, createdConversation)
        return createdConversation
    }

    async newGroupConversation(sender: string, users: string[], conversationName: string, conversationPic: string, message: string): Promise<ConversationType> { 
        const conversation = {
            users: [...users, sender],
            admins: [sender],
            conversationName: conversationName,
            conversationPic: conversationPic,
            latestMessage: message,
            latestMessager: sender
        }
        const createdConversation = await this.conversationModel.create(conversation)
        await createdConversation.populate("users", "-password")
        await createdConversation.populate("admins", "-password")
        await createdConversation.populate("latestMessager", "-password")
        const chat = await this.chatService.createChat(message, sender, createdConversation)
        return createdConversation
    }

    async updateConversation(id: string, conversationId: string, message: string): Promise<ConversationType> {
        const updatedConversation = await this.conversationModel.findByIdAndUpdate(
            conversationId, 
            { $set: {latestMessage: message, latestMessager: id}}, {new: true})
        await updatedConversation.populate("users", "-password")
        await updatedConversation.populate("admins", "-password")
        await updatedConversation.populate("latestMessager", "-password")
        const chat = await this.chatService.createChat(message, id, updatedConversation)
        return updatedConversation
    }

    async getConversations(id: string): Promise<ConversationType[]> {
        const conversations = await this.conversationModel.find(
            { 
                users: { $elemMatch: { $eq: id }},
                latestMessage: { $ne: "" }
            }).populate("users", "-password").populate("admins", "-password").populate("latestMessager", "-password").sort({updatedAt: -1})
        return conversations
    }

    async editGroupName(id: string, conversationId: string, conversationName: string, message: string): Promise<ConversationType> {
        const conversation = await this.conversationModel.findByIdAndUpdate(conversationId, 
            {
                conversationName: conversationName,
                latestMessage: message,
                latestMessager: id
            },
            {
                new: true
            }).populate("users", "-password").populate("admins", "-password").populate("latestMessager", "-password")
            const chat = await this.chatService.createChat(message, id, conversation)
        return conversation
    }

    async editGroupPic(id: string, conversationId: string, conversationPic: string, message: string): Promise<ConversationType> {
        const conversation = await this.conversationModel.findByIdAndUpdate(conversationId, 
            {
                conversationPic: conversationPic,
                latestMessage: message,
                latestMessager: id
            },
            {
                new: true
            }).populate("users", "-password").populate("admins", "-password").populate("latestMessager", "-password")
            const chat = await this.chatService.createChat(message, id, conversation)
        return conversation
    }

    async addGroupMember(id: string, conversationId: string, user: string, message: string): Promise<ConversationType> {
        const conversation = await this.conversationModel.findByIdAndUpdate(conversationId, 
            {
                $push: { users: user },
                latestMessage: message,
                latestMessager: id
            },
            {
                new: true
            }).populate("users", "-password").populate("admins", "-password").populate("latestMessager", "-password")
            const chat = await this.chatService.createChat(message, id, conversation)
        return conversation
    }

    async removeGroupMember(id: string, conversationId: string, userId: string, message: string): Promise<ConversationType> {
        const conversation = await this.conversationModel.findByIdAndUpdate(conversationId, 
            {
                $pull: { users: userId },
                latestMessage: message,
                latestMessager: id
            },
            {
                new: true
            }).populate("users", "-password").populate("admins", "-password").populate("latestMessager", "-password")
            const chat = await this.chatService.createChat(message, id, conversation)
        return conversation
    }

    async deleteGroup(conversationId: string): Promise<ConversationType> {
        await this.chatModel.deleteMany({ conversation: conversationId })
        return await this.conversationModel.findByIdAndRemove(conversationId)
    }
}

