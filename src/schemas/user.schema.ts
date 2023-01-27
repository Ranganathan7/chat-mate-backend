import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type UserType = User & Document

@Schema({ collection: "users" })
export class User{
    @Prop({ unique: true, trim: true }) 
    name: string

    @Prop({ unique: true })
    email: string

    @Prop()
    password: string

    @Prop({ default: false })
    online: boolean

    @Prop({ default: Date.now() })
    lastOnline: Date

    @Prop()
    pic: string
}

export const UserSchema = SchemaFactory.createForClass(User)
