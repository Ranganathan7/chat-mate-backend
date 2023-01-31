import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets/decorators"
import { Server, Socket } from "socket.io"
import { ConversationService } from "src/conversation/conversation.service"
import { User, UserType } from "src/schemas/user.schema"
import { UserAlreadyExistsException } from "src/user/user.exception"

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
        this.server.emit("message", conversationId)
        // const conversation = await this.conversationService.getConversation(conversationId)
        // conversation.users.map((user: UserType) => {
        //     this.server.in(user._id as string).emit("message", conversationId)
        // })
    }

    @SubscribeMessage('newGroup')
    async handleNewGroup(
            @ConnectedSocket() client: Socket,
            @MessageBody('conversationId') conversationId: string
        ) {
            this.server.emit("message", conversationId)
            // const conversation = await this.conversationService.getConversation(conversationId)
            // conversation.users.map((user: UserType) => {
            //     this.server.in(user._id).emit("message", conversationId)
            // })
    }  
    
    @SubscribeMessage('deleteGroup')
    async handledeleteGroup(
            @ConnectedSocket() client: Socket,
            @MessageBody('conversationId') conversationId: string
        ) {
        this.server.emit("deleted", conversationId)
    }  

    @SubscribeMessage('userOnline')
    async userOnline(@ConnectedSocket() client: Socket) {
        client.broadcast.emit("userOnline")
    }

    @SubscribeMessage('startTyping') 
    async startTyping(
        @MessageBody('conversationId') conversationId: string,
        @MessageBody('userId') userId: string,
    ) {
        this.server.in(conversationId).emit("startedTyping", {conversationId: conversationId, userId: userId})
    }

    @SubscribeMessage('stopTyping') 
    async stopTyping(
        @MessageBody('conversationId') conversationId: string,
        @MessageBody('userId') userId: string,
    ) {
        this.server.in(conversationId).emit("stoppedTyping", {conversationId: conversationId, userId: userId})
    }
}