import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets/decorators"
import { Server, Socket } from "socket.io"
import { ConversationService } from "src/conversation/conversation.service"
import { UserType } from "src/schemas/user.schema"

@WebSocketGateway({
    cors: '*'
}) 

export class SocketGateway {

    constructor(private readonly conversationService: ConversationService) {}

    @WebSocketServer()
    server: Server

    @SubscribeMessage('joinChatMate')
    async handleJoinChatMate(
            @ConnectedSocket() client: Socket,
            @MessageBody('userId') userId: string
        ) {
        client.join(userId)
    }

    @SubscribeMessage('joinConversation')
    async handleJoinConversation(
            @ConnectedSocket() client: Socket,
            @MessageBody('conversationId') conversationId: string
        ) {
        client.join(conversationId)
    }

    @SubscribeMessage('newMessage')
    async handleNewMessage(
            @ConnectedSocket() client: Socket,
            @MessageBody('conversationId') conversationId: string
        ) {
        this.server.in(conversationId).emit("message", conversationId)
    }

    @SubscribeMessage('userOnline')
    async userOnline(@ConnectedSocket() client: Socket) {
        client.broadcast.emit("userOnline")
    }

    @SubscribeMessage('typing') 
    async typing() {

    }
}