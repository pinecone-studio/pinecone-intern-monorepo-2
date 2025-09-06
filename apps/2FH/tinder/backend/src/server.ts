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
    origin: [
      "http://localhost:4300",
      "http://localhost:4201",
      process.env.FRONTEND_URL || "http://localhost:3000"
    ],
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

// Setup database connection
const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tinder';
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Test the connection
    const db = mongoose.connection;
    db.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
    db.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

// Setup Apollo Server
const setupApolloServer = async () => {
  await apolloServer.start();

  // Apply middleware
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4201',
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    credentials: true
  }));
  app.use(json());
  app.use('/graphql', expressMiddleware(apolloServer as any));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json(getServerStatus());
  });
};

// Setup graceful shutdown handlers
const setupGracefulShutdown = () => {
  const shutdownHandler = async (signal: string) => {
    console.log(`${signal} received, shutting down gracefully`);
    await closeServer();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
  process.on('SIGINT', () => shutdownHandler('SIGINT'));
};

// Start HTTP servers
const startHttpServers = () => {
  const port = process.env.PORT || 4200;
  const socketPort = process.env.SOCKET_PORT || 4300;

  httpServer.listen(socketPort, () => {
    console.log(`Socket.IO server running on port ${socketPort}`);
  });

  app.listen(port, () => {
    console.log(`Apollo Server running on port ${port}`);
  });
};

// Start server function
const startServer = async () => {
  try {
    await connectToDatabase();
    await setupApolloServer();
    setupGracefulShutdown();
    startHttpServers();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
setTimeout(startServer, 1000);

export { httpServer, io, userSocketMap, isServerReady, getServerStatus, closeServer }; 