// src/contexts/SocketContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO client
    const newSocket = io('http://localhost:4000'); // Signaling server URL
    setSocket(newSocket);

    // Cleanup on unmount
    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
