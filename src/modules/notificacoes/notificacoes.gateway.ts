import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'https://d399mtdh0ga8g7.cloudfront.net',
      'http://d399mtdh0ga8g7.cloudfront.net',
      'http://frontend-mes-195950944161-us-east-1-an.s3-website-us-east-1.amazonaws.com',
      'http://localhost:3003',
    ],
    credentials: true,
  },
  namespace: '/ws',
})
export class NotificacoesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`[WS] Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[WS] Cliente desconectado: ${client.id}`);
  }

  emitirStatusOP(payload: {
    id: number;
    codigo: string;
    statusAnterior: string;
    statusNovo: string;
  }) {
    this.server.emit('op:status_alterado', payload);
  }

  emitirStatusMaquina(payload: {
    id: number;
    codigo: string;
    nome: string;
    statusAnterior: string;
    statusNovo: string;
  }) {
    this.server.emit('maquina:status_alterado', payload);
  }

  emitirStatusManutencao(payload: {
    id: number;
    maquinaId: number;
    statusAnterior: string;
    statusNovo: string;
  }) {
    this.server.emit('manutencao:status_alterado', payload);
  }
}
