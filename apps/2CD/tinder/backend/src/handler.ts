import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schemas';
import { NextRequest } from 'next/server';
import { resolvers } from './resolvers';
import { connectToDb } from './utils/connect-to-db';
import { Context } from './types';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

connectToDb();

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
  introspection: true,
});

export const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    const authHeader = req.headers.get('authorization') || '';
    let user = null;

    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        user = jwt.verify(token, JWT_SECRET);
      } catch (e) {
        // invalid token, user stays null
      }
    }

    return { req, user };
  },
});
