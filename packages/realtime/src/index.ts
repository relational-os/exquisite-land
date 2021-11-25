import { Server } from 'socket.io';

// TODO: figure out a good encoding mechanism?
type Pixels = readonly (readonly number[])[];

export interface ServerToClientEvents {
  progress: (x: number, y: number, pixels: Pixels) => void;
}

export interface ClientToServerEvents {
  progress: (x: number, y: number, pixels: Pixels) => void;
}

interface InterServerEvents {}
interface SocketData {}

const port = +(process.env.PORT || 3001);

const io = new Server<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>(port);

io.on('connection', (socket) => {
  socket.join('progress');
  socket.on('progress', (x, y, pixels) => {
    io.to('progress').emit('progress', x, y, pixels);
  });
});
