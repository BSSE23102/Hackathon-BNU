import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000';

type SocketMap = Record<string, Socket>;

const sockets: SocketMap = {};

export function getSocket(namespace: string): Socket {
  if (!sockets[namespace]) {
    sockets[namespace] = io(`${SOCKET_URL}${namespace}`, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return sockets[namespace];
}

export function connectSocket(namespace: string): Socket {
  const socket = getSocket(namespace);
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function disconnectSocket(namespace: string): void {
  const socket = sockets[namespace];
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function disconnectAll(): void {
  Object.keys(sockets).forEach(disconnectSocket);
}

export const NAMESPACES = {
  CONTENT: '/ws/content',
  RISK: '/ws/risk',
  DECISION: '/ws/decision',
  HUMAN: '/ws/human',
  COST: '/ws/cost',
} as const;
