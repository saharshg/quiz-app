import { Socket } from 'socket.io';

export class UserManager {
  private users: {
    roomId: string;
    socket: Socket;
  }[];

  constructor() {
    this.users = [];
  }

  addUser(roomId: string, socket: Socket) {
    this.users.push({
      roomId,
      socket,
    });

    this.createHandlers(roomId, socket);
  }

  createHandlers(roomId: string, socket: Socket) {}
}
