import * as mongoose from "mongoose"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { User } from "./user.schema"

export type ConversationType = Conversation & Document

@Schema({ collection: "conversations", timestamps: true })
export class Conversation{
    @Prop()
    latestMessage: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    latestMessager: User

    @Prop({ default: "" })
    conversationName: string

    @Prop({ default: "https://i.pinimg.com/originals/cf/f3/58/cff3584f65cf4fe72c9591500a7c5c8f.jpg" })
    conversationPic: string

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "User" })
    users: User[]

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "User" })
    admins: User[]
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)