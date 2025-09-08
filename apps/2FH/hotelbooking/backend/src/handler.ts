import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schemas';
import { resolvers } from './resolvers';
import { connectToDb } from './utils/connect-to-db';
import { Context } from './types';
import { UserModel } from './models';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

connectToDb();

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,

  introspection: true,
});

export const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (request: NextRequest) => {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return { req: request };

    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await UserModel.findById(decoded.id).select('-password');
      return { req: request, user };
    } catch {
      return { req: request };
    }
  },
});
