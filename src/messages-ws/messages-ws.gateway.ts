import { JwtPayload } from '@app/auth/interfaces';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  // handleConnection(client: Socket, ...args: any[]) {
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
      this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
    } catch (error) {
      console.log(error);
      client.disconnect();
      return;
    }
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeCLient(client.id);
    const connectedClients = this.messagesWsService.getConnectedClients();
    this.wss.emit('clients-updated', connectedClients);
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite únicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no message!!',
    // });

    //! Emitir a todos MENOS, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no message!!',
    // });

    console.log(this.messagesWsService.getUserFullNameSocket(client.id));

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameSocket(client.id),
      message: payload.message || 'no message!!',
    });
  }
}
