import * as mongoose from "mongoose"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Conversation } from "./converstaion.schema"
import { User } from "./user.schema"

export type ChatType = Chat & Document

@Schema({ collection: "chats", timestamps: true })
export class Chat{
    @Prop({ trim: true })
    content: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    author: User

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Conversation" })
    conversation: Conversation
}

export const ChatSchema = SchemaFactory.createForClass(Chat)