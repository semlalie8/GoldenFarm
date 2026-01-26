let io;

export const initSocket = (serverInstance) => {
    io = serverInstance;
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitEvent = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};
