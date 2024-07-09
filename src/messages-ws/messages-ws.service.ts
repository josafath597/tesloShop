import { User } from '@app/auth/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private connectedCLient: ConnectedClients = {};
  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User is not active');
    delete user.password;
    this.checkUserConnection(user);
    this.connectedCLient[client.id] = {
      socket: client,
      user,
    };
  }

  removeCLient(clientId: string) {
    delete this.connectedCLient[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedCLient);
  }

  getUserFullNameSocket(id: string) {
    return this.connectedCLient[id].user.fullName;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedCLient)) {
      const connectedClient = this.connectedCLient[clientId];
      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
