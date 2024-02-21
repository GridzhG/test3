import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets'
import {Server, Socket} from "socket.io"
import { default as config } from 'config.json'

@WebSocketGateway({ origin: config.cors.frontend_url })
export class SocketGateway {
  @WebSocketServer()
  public socket: Server
  realUsers: any

  constructor(
  ) {
    this.realUsers = {}
  }

  handleDisconnect(client: Socket) {
    if (typeof this.realUsers[client.request.connection.remoteAddress] !== 'undefined') {
      delete this.realUsers[client.request.connection.remoteAddress]
    }

    this.updateOnline()
  }

  handleConnection(client: Socket) {
    if (typeof this.realUsers[client.request.connection.remoteAddress] === 'undefined') {
      this.realUsers[client.request.connection.remoteAddress] = 1
    }

    this.updateOnline()
  }

  updateOnline() {
    this.socket.emit('online', Object.keys(this.realUsers).length)
  }
}
