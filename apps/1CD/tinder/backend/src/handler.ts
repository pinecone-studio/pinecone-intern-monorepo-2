import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from './schemas';
import { NextRequest } from 'next/server';
import { resolvers } from './resolvers';
import { connectToDb } from './utils/connect-to-db';
import { Context } from './types';
import { getUserId } from './utils/token';


connectToDb();



const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
  introspection: true,
});

export const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req)=> {
    const authHeader=`${req.headers.get('authorization')}`;
    const authToken=authHeader?.replace('Bearer ','');
    const isNodeEnv=process.env.NODE_ENV;
    

    
    if(isNodeEnv==="production" && authToken){
      const userId=getUserId(authToken)||'';
      return {req,userId}
    }

    return { req, userId: "675675e84bd85fce3de34006" };
   
  },
});
