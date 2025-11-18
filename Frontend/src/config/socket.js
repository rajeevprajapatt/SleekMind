import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
    socketInstance = io(import.meta.env.VITE_API_URL, {
        transports: ["websocket", "polling"], // IMPORTANT
        withCredentials: true,               // CORS FIX
        auth: {
            token: localStorage.getItem("token"),
        },
        query: {
            projectId,   // allowed
        }
    });

    return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
    if (!socketInstance) {
        console.error("Socket not initialized yet.");
        return;
    }
    socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
    if (!socketInstance) {
        console.error("Socket not initialized yet.");
        return;
    }
    socketInstance.emit(eventName, data);
};
