import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthSocket } from 'src/chat/ws.authenticated.guard';
import Notification from 'src/entities/notification.entity';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway {
  @WebSocketServer() server: Server;

  private clients: AuthSocket[] = [];

  async sendToUser(userId: number, notification: Notification) {
    
    const client = this.clients.find((client) => client.user.id === userId);
    
    if (!client) return;
    client.emit('NEW_NOTIFICATION', notification);
  }

  getClients = () => {
    return this.clients;
  };

  handleConnection(client: AuthSocket, ...args: any[]) {
    // 
    
    client.user = (client.request as any).user;
    this.clients.push(client);
    // 
  }

  handleDisconnect(client: Socket) {
    // 
    
    this.clients.splice(
      this.clients.findIndex((c) => c.id === client.id),
      1,
    );
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
