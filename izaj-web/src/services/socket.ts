import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!url) {
      console.warn('NEXT_PUBLIC_SOCKET_URL is not defined; socket will stay offline.');
      return null;
    }

    socket = io(url, {
      transports: ['websocket', 'polling'], // Allow polling as fallback
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    // Add error handlers
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

