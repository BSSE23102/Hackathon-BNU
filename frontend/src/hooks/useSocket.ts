'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket } from '@/lib/socket';

export function useSocket(
  namespace: string,
  events: Record<string, (data: unknown) => void>
) {
  const socketRef = useRef<Socket | null>(null);
  const eventsRef = useRef(events);
  eventsRef.current = events;

  useEffect(() => {
    const socket = connectSocket(namespace);
    socketRef.current = socket;

    Object.entries(eventsRef.current).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    socket.on('connect', () => {
      console.log(`[WS] Connected: ${namespace}`);
    });

    socket.on('disconnect', (reason) => {
      console.warn(`[WS] Disconnected: ${namespace} — ${reason}`);
    });

    socket.on('connect_error', (err) => {
      console.error(`[WS] Error: ${namespace}`, err.message);
    });

    return () => {
      Object.keys(eventsRef.current).forEach((event) => {
        socket.off(event);
      });
      disconnectSocket(namespace);
    };
  }, [namespace]);

  const emit = useCallback(
    (event: string, data?: unknown) => {
      socketRef.current?.emit(event, data);
    },
    []
  );

  return { emit, socket: socketRef };
}
