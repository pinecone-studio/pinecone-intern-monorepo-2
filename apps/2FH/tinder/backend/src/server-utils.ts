import mongoose from 'mongoose';
import { httpServer, io } from './server-core';

const checkServerExists = (): boolean => {
    return !!(httpServer && io);
};

const checkServerListening = (): boolean => {
    return !!httpServer.listening;
};

const checkIOEngine = (): boolean => {
    return !!io.engine;
};

export const isServerReady = (): boolean => {
    try {
        return checkServerExists() && checkServerListening() && checkIOEngine();
    } catch (error) {
        console.log('Server status check failed:', error);
        return false;
    }
};

export const getServerStatus = () => {
    const serverStatus = {
        isReady: isServerReady(),
        port: process.env.SOCKET_PORT || 4300,
        connections: 0,
        serverListening: httpServer?.listening || false
    };
    return serverStatus;
};

// Helper functions for closing server
const closeSocketIO = async (): Promise<void> => {
    if (io) {
        io.removeAllListeners();
        io.close();
    }
};

const handleHTTPCloseError = (err: Error, reject: (_reason?: any) => void): void => {
    console.error('HTTP серверийг хаахад алдаа гарлаа:', err);
    reject(err);
};

const handleServerClose = (resolve: () => void, reject: (_reason?: any) => void) => {
    if (httpServer) {
        httpServer.close((err) => {
            if (err) {
                handleHTTPCloseError(err, reject);
                return;
            }
            resolve();
        });
    } else {
        resolve();
    }
};

const closeHTTP = (): Promise<void> => new Promise((resolve, reject) => {
    handleServerClose(resolve, reject);
});

const disconnectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB холболт хаагдлаа');
    }
    catch (error) {
        console.error('MongoDB холболтыг хаахад алдаа гарлаа:', error);
        throw error;
    }
};

export const closeServer = async (): Promise<void> => {
    try {
        await closeSocketIO();
        await closeHTTP();
        await disconnectMongoDB();
    }
    catch (error) {
        console.error('Server close error:', error);
        throw error;
    }
}; 