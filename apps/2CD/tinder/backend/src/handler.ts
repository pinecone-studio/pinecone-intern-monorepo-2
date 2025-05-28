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
    const auth = req.headers.get('authorization') || '';
    let user;

    if (auth.startsWith('Bearer ')) {
      const token = auth.replace('Bearer ', '');

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
        user = { _id: decoded._id };
      } catch (err) {
        console.error('JWT verification failed:', err);
      }
    }

    return { user };
  },
});
