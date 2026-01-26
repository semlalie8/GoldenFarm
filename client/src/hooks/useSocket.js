import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (onEvent) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(socketUrl, {
            withCredentials: true
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket Connected:', newSocket.id);
        });

        // Register event listeners
        if (onEvent) {
            Object.keys(onEvent).forEach((eventName) => {
                newSocket.on(eventName, onEvent[eventName]);
            });
        }

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    return socket;
};

export default useSocket;
