import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import { Request, Response, Express } from 'express';
import { Server } from 'http';
import { getServerStatus } from './server-utils';

export const connectToDatabase = async (): Promise<void> => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tinder';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
};

export const setupApolloServer = async (apolloServer: ApolloServer): Promise<void> => {
    await apolloServer.start();
};

export const setupMiddleware = (app: Express, apolloServer: ApolloServer): void => {
    app.use(cors());
    app.use(json());
    app.use('/graphql', expressMiddleware(apolloServer as any));
};

export const setupHealthEndpoint = (app: Express): void => {
    app.get('/health', (req: Request, res: Response) => {
        res.json(getServerStatus());
    });
};

export const startHttpServers = (httpServer: Server, app: Express): void => {
    const port = process.env.PORT || 4000;
    const socketPort = process.env.SOCKET_PORT || 4300;

    httpServer.listen(socketPort, () => {
        console.log(`Socket.IO server running on port ${socketPort}`);
    });

    app.listen(port, () => {
        console.log(`Apollo Server running on port ${port}`);
    });
};

export const setupGracefulShutdown = (closeServer: () => Promise<void>): void => {
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
};