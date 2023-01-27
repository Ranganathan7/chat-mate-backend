import { Module, RequestMethod } from "@nestjs/common";
import { MiddlewareConsumer, NestModule } from "@nestjs/common/interfaces";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatService } from "src/chat/chat.service";
import { ValidateJwtMiddleware } from "src/middlewares/validateJwt.middleware";
import { Chat, ChatSchema } from "src/schemas/chat.schema";
import { Conversation, ConversationSchema } from "src/schemas/converstaion.schema";
import { User, UserSchema } from "src/schemas/user.schema";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema},
            { name: Chat.name, schema: ChatSchema},
            { name: Conversation.name, schema: ConversationSchema}
        ])
    ],
    controllers: [ConversationController],
    providers: [ConversationService, ChatService]
})

export class ConversationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ValidateJwtMiddleware)
            .forRoutes(ConversationController)
    }
}