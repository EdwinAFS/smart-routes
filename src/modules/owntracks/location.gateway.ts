import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface LocationUpdate {
  _type: string;
  id: string;
  lat: string;
  lng: string;
  name: string;
  timestamp?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/locations',
})
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clientsCount = 0;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
    this.clientsCount++;
    this.emitClientsCount();
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    this.clientsCount--;
    this.emitClientsCount();
  }

  sendLocationUpdate(data: any) {
    this.server.emit('locationUpdate', data);
  }

  sendLocationToDriver(driverId: string, data: any) {
    this.server.to(driverId).emit('locationUpdate', data);
  }

  private emitClientsCount() {
    this.server.emit('clientsCount', this.clientsCount);
  }
}
