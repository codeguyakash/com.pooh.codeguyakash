import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_BASE_URL } from '../env/base_url';

const SOCKET_URL = SOCKET_BASE_URL || 'https://pooh-codeguyakash.vercel.app';

interface SocketContextType {
  socket: Socket | null;
  sendMessage: (message: any) => void;
  lastMessage: any;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  sendMessage: () => {},
  lastMessage: null,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🟢 Connected to socket server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected from socket server');
    });

    socket.on('receive_message', (data) => {
      console.log('📩 Message received from server:', data);
      setLastMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socketRef.current) {
      console.log('📤 Sending message:', message);
      socketRef.current.emit('send_message', message);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        sendMessage,
        lastMessage,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
