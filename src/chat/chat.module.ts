import { Module, RequestMethod } from "@nestjs/common";
import { MiddlewareConsumer, NestModule } from "@nestjs/common/interfaces";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationService } from "../conversation/conversation.service";
import { ValidateJwtMiddleware } from "../middlewares/validateJwt.middleware";
import { Chat, ChatSchema } from "../schemas/chat.schema";
import { Conversation, ConversationSchema } from "../schemas/converstaion.schema";
import { User, UserSchema } from "../schemas/user.schema";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema},
            { name: Chat.name, schema: ChatSchema},
            { name: Conversation.name, schema: ConversationSchema}
        ])
    ],
    controllers: [ChatController],
    providers: [ChatService, ConversationService]
})

export class ChatModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ValidateJwtMiddleware)
            .forRoutes(ChatController)
    }
}