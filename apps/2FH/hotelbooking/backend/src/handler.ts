import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schemas';
import { NextRequest } from 'next/server';
import { resolvers } from './resolvers';
import { connectToDb } from './utils/connect-to-db';
import { Context } from './types';

// Initialize database connection
let isDbConnected = false;

const initializeDatabase = async () => {
  try {
    await connectToDb();
    isDbConnected = true;
    console.log('🚀 Database initialized successfully');
  } catch (error) {
    console.error('💥 Failed to initialize database:', error);
    // Don't throw here, let the server start but mark connection as failed
    isDbConnected = false;
  }
};

// Initialize database connection
initializeDatabase();

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
  introspection: true,
  // Add health check for database connection
  plugins: [
    {
      requestDidStart: async () => ({
        willSendResponse: async ({ response }) => {
          // Add database connection status to response headers
          if (response.http) {
            response.http.headers.set('X-Database-Status', isDbConnected ? 'connected' : 'disconnected');
          }
        },
      }),
    },
  ],
});

export const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    // Add database connection status to context
    return { 
      req,
      dbConnected: isDbConnected 
    };
  },
});
