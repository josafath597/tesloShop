import { AuthModule } from '@app/auth/auth.module';
import { Module } from '@nestjs/common';
import { MessagesWsGateway } from './messages-ws.gateway';
import { MessagesWsService } from './messages-ws.service';

@Module({
  providers: [MessagesWsGateway, MessagesWsService],
  imports: [AuthModule],
})
export class MessagesWsModule {}
