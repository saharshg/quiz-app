import { Server } from 'socket.io';
import { IOManager } from './managers/IOManager';

const io = IOManager.getIO();

io.listen(3000);

io.on('connection', (client) => {
  client.on('event', (data) => {
    console.log(data);
  });
  client.on('disconnect', () => {});
});
