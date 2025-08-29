import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import { typeDefs } from './schemas';
import { resolvers } from './resolvers';
import { isServerReady, getServerStatus, closeServer } from './server-utils';

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Store user socket connections
const userSocketMap = new Map<string, string>();

// Apollo Server setup
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

// Socket event handling
const setupSocketEvents = (socket: any) => {
    console.log('User connected:', socket.id);

    socket.on('user_login', (userId: string) => {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    socket.on('user_logout', (userId: string) => {
        userSocketMap.delete(userId);
        console.log(`User ${userId} disconnected`);
    });

    socket.on('disconnect', () => {
        // Remove user from userSockets map
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
};

io.on('connection', setupSocketEvents);

// Start server function
const startServer = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tinder';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Start Apollo Server
        await apolloServer.start();

        // Apply middleware
        app.use(cors());
        app.use(json());
        app.use('/graphql', expressMiddleware(apolloServer));

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.json(getServerStatus());
        });

        // Start HTTP server
        const port = process.env.PORT || 4000;
        const socketPort = process.env.SOCKET_PORT || 4300;

        httpServer.listen(socketPort, () => {
            console.log(`Socket.IO server running on port ${socketPort}`);
        });

        app.listen(port, () => {
            console.log(`Apollo Server running on port ${port}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received, shutting down gracefully');
            await closeServer();
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            console.log('SIGINT received, shutting down gracefully');
            await closeServer();
            process.exit(0);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
setTimeout(startServer, 1000);

export { httpServer, io, userSocketMap, isServerReady, getServerStatus, closeServer }; 