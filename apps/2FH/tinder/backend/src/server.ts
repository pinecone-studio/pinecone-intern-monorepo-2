import express, { Request } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import { typeDefs } from './schemas';
import { resolvers } from './resolvers';
import { isServerReady, getServerStatus, closeServer } from './utils/server-utils';

// Express-specific context type
interface ExpressContext {
    req: Request;
    currentUser?: {
        userId: string;
    };
}

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
const apolloServer = new ApolloServer<ExpressContext>({
    typeDefs,
    resolvers,
});

// Socket event handling
const setupSocketEvents = (socket: Socket) => {
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

// Helper functions for server setup
const connectToDatabase = async (): Promise<void> => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tinder';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
};

const setupApolloServer = async (): Promise<void> => {
    await apolloServer.start();
    console.log('Apollo Server started');
};

const setupMiddleware = (): void => {
    app.use(cors());
    app.use(json());
    app.use('/graphql', expressMiddleware(apolloServer, {
        context: async ({ req }): Promise<ExpressContext> => {
            return {
                req,
                currentUser: undefined // Add user authentication logic here if needed
            };
        }
    }));
};

const setupHealthEndpoint = (): void => {
    app.get('/health', (req, res) => {
        res.json(getServerStatus());
    });
};

const startServers = (): void => {
    const port = process.env.PORT || 4000;
    const socketPort = process.env.SOCKET_PORT || 4300;

    httpServer.listen(socketPort, () => {
        console.log(`Socket.IO server running on port ${socketPort}`);
    });

    app.listen(port, () => {
        console.log(`Apollo Server running on port ${port}`);
    });
};

const setupGracefulShutdown = (): void => {
    const shutdown = async (signal: string) => {
        console.log(`${signal} received, shutting down gracefully`);
        await closeServer();
        process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
};

// Start server function
const startServer = async (): Promise<void> => {
    try {
        await connectToDatabase();
        await setupApolloServer();
        setupMiddleware();
        setupHealthEndpoint();
        startServers();
        setupGracefulShutdown();
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
setTimeout(startServer, 1000);

export { httpServer, io, userSocketMap, isServerReady, getServerStatus, closeServer }; 