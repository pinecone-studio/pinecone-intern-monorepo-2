import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schemas';
import { NextRequest } from 'next/server';
import { resolvers } from './resolvers';
import { connectToDb } from './utils/connect-to-db';
import { Context } from './types';

async function start() {
  await connectToDb();

  const server = new ApolloServer<Context>({
    resolvers,
    typeDefs,
    introspection: true,
  });

  return startServerAndCreateNextHandler<NextRequest, Context>(server, {
    context: async (req) => {
      return { req };
    },
  });
}

export const handler = await start();
