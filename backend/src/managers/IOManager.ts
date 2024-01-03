import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();

export class IOManager {
  private static io: Server;

  public static getIO() {
    if (!this.io) {
      const io = new Server(server);
      this.io = io;
    }
    return this.io;
  }
}
