import { io, Socket } from 'socket.io-client';
import {
  ServerToClientEvents,
  ClientToServerEvents
} from '@exquisiteland/realtime';

// TODO: configure in env
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3001'
);
