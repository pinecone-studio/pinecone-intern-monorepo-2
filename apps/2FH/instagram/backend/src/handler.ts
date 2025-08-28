import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schemas';
import { NextRequest } from 'next/server';
import { resolvers } from './resolvers';
import { connectToDb } from './utils/connect-to-db';
import { Context } from './types/context';
import { extractTokenFromHeader, verifyToken } from './utils/jwt';

connectToDb();

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
  introspection: true,
});

export const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    let userId: string | undefined;

    try {
      // Extract token from Authorization header
      const authHeader = req.headers.get('authorization');
      if (authHeader) {
        const token = extractTokenFromHeader(authHeader);
        const decoded = await verifyToken(token);
        userId = decoded.userId;
      }
    } catch (error) {
      // If token is invalid or missing, userId remains undefined
      // This allows for public mutations/queries to work
      console.warn('Authentication failed:', error);
    }

    return { req, userId };
  },
});
