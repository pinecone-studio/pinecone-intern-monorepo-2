import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schemas';
import { NextRequest } from 'next/server';
import { resolvers } from './resolvers';
import { connectToDb } from './utils/connect-to-db';
import { Context } from './types';
import jwt, { JwtPayload } from 'jsonwebtoken';

connectToDb();

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
  introspection: true,
});

export const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    const token = req.headers.get('authorization') || '';

    let userId = null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      userId = decoded.id;
    } catch {
      userId = null;
    }

    return {
      userId,
    };
  },
});
