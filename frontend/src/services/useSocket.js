import { useEffect } from 'react';
import socket from '../services/socketClient';

const useSocket = (userId) => {
  useEffect(() => {
    if (userId) {
      socket.emit('register', userId);
    }
    return () => {
      if (userId) {
        socket.emit('leave', userId);
      }
    };
  }, [userId]);

  return socket;
};

export default useSocket;