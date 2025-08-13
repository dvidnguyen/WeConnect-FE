import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import socketService from '@/services/socket.service';

interface SocketContextType {
  isConnected: boolean;
  socketId: string | undefined;

  // Friend request methods
  sendFriendRequest: (userId: string, message?: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;

  // Event listeners với typed callbacks (match với BE events)
  onFriendRequestReceived: (callback: (data: unknown) => void) => void;
  onFriendRequestAccepted: (callback: (data: unknown) => void) => void;
  onFriendRequestRejected: (callback: (data: unknown) => void) => void;
  onNotification: (callback: (data: unknown) => void) => void;
  onConnected: (callback: (data: unknown) => void) => void;

  // Generic methods
  emit: (event: string, data?: unknown) => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  off: (event: string, callback?: (data: unknown) => void) => void;
}const SocketContext = createContext<SocketContextType | null>(null);

export { SocketContext };

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { email, username } = useAppSelector(state => state.auth);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | undefined>(undefined);

  // Friend request methods
  const sendFriendRequest = useCallback((userId: string, message?: string) => {
    socketService.sendFriendRequest(userId, message);
  }, []);

  const acceptFriendRequest = useCallback((requestId: string) => {
    socketService.acceptFriendRequest(requestId);
  }, []);

  const rejectFriendRequest = useCallback((requestId: string) => {
    socketService.rejectFriendRequest(requestId);
  }, []);

  // Event listener methods (match với BE events)
  const onFriendRequestReceived = useCallback((callback: (data: unknown) => void) => {
    socketService.on('friend', callback); // BE sends 'friend' event
  }, []);

  const onFriendRequestAccepted = useCallback((callback: (data: unknown) => void) => {
    socketService.on('friend-accepted', callback); // BE sends 'friend-accepted'
  }, []);

  const onFriendRequestRejected = useCallback((callback: (data: unknown) => void) => {
    socketService.on('friend-rejected', callback); // BE sends 'friend-rejected'
  }, []);

  const onNotification = useCallback((callback: (data: unknown) => void) => {
    socketService.on('notification', callback);
  }, []);

  // Listen for server connection confirmation
  const onConnected = useCallback((callback: (data: unknown) => void) => {
    socketService.on('connected', callback); // BE sends 'connected' on successful auth
  }, []);

  // Generic methods
  const emit = useCallback((event: string, data?: unknown) => {
    socketService.emit(event, data);
  }, []);

  const on = useCallback((event: string, callback: (data: unknown) => void) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: (data: unknown) => void) => {
    socketService.off(event, callback);
  }, []);

  // Update connection status
  const updateConnectionStatus = useCallback(() => {
    setIsConnected(socketService.isConnected());
    setSocketId(socketService.getSocketId());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && email && username) {
      console.log('🔌 Connecting to socket with token...');
      socketService.connect(token);

      // Update connection status after connection attempt
      const timeoutId = setTimeout(() => {
        updateConnectionStatus();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }

    // Cleanup khi component unmount hoặc user logout
    return () => {
      if (!email || !username) {
        console.log('🔌 User logged out, disconnecting socket...');
        socketService.disconnect();
        setIsConnected(false);
        setSocketId(undefined);
      }
    };
  }, [email, username, updateConnectionStatus]);

  // Disconnect khi user logout
  useEffect(() => {
    if (!email || !username) {
      socketService.disconnect();
      setIsConnected(false);
      setSocketId(undefined);
    }
  }, [email, username]);

  // Periodic connection status check
  useEffect(() => {
    const interval = setInterval(updateConnectionStatus, 5000);
    return () => clearInterval(interval);
  }, [updateConnectionStatus]);

  const contextValue: SocketContextType = {
    isConnected,
    socketId,

    // Friend methods
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,

    // Event listeners
    onFriendRequestReceived,
    onFriendRequestAccepted,
    onFriendRequestRejected,
    onNotification,
    onConnected,

    // Generic methods
    emit,
    on,
    off,
  }; return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
