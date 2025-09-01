import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schemas';
import { NextRequest } from 'next/server';
import { resolvers } from './resolvers';
import { connectToDb } from './utils/connect-to-db';
import { Context } from './types';
import jwt from 'jsonwebtoken';

// Ensure database connection is established before server starts
(async () => {
  try {
    await connectToDb();
    console.log('🚀 Database connected, server ready to start');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
})();

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
  introspection: true,
});

// Extract JWT verification logic to reduce complexity
const verifyJWTToken = (token: string): { userId: string } | undefined => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    return decoded?.userId ? { userId: decoded.userId } : undefined;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return undefined;
  }
};

// Extract user extraction logic to reduce complexity
const extractUserFromHeader = (authHeader: string | null): { userId: string } | undefined => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return undefined;
  }
  
  const token = authHeader.substring(7);
  return verifyJWTToken(token);
};

export const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    const authHeader = req.headers.get('authorization');
    const currentUser = extractUserFromHeader(authHeader);
    
    return { req, currentUser };
  },
});
