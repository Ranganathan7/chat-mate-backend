import { Module, RequestMethod } from "@nestjs/common";
import { MiddlewareConsumer, NestModule } from "@nestjs/common/interfaces";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatService } from "../chat/chat.service";
import { ValidateJwtMiddleware } from "../middlewares/validateJwt.middleware";
import { Chat, ChatSchema } from "../schemas/chat.schema";
import { Conversation, ConversationSchema } from "../schemas/converstaion.schema";
import { User, UserSchema } from "../schemas/user.schema";
import { SocketGateway } from "../websocket/socket.gateway";
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
    providers: [ConversationService, ChatService, SocketGateway]
})

export class ConversationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ValidateJwtMiddleware)
            .forRoutes(ConversationController)
    }
}