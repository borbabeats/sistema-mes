import { Module } from '@nestjs/common';
import { NotificacoesGateway } from './notificacoes.gateway';

@Module({
  providers: [NotificacoesGateway],
  exports: [NotificacoesGateway],
})
export class NotificacoesModule {}
