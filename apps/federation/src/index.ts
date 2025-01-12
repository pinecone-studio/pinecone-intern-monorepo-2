import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

const app = express();

dotenv.config();
app.use(cors());
app.use(json());

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    request.http.headers.set('authorization', context?.headers?.authorization);
  }
}

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      {
        name: 'assessment',
        url: process.env.ASSESSMENT_SERVICE,
      },
      {
        name: 'challenge',
        url: process.env.CHALLENGE_SERVICE,
      },
      {
        name: 'courses',
        url: process.env.COURSES_SERVICE,
      },
      {
        name: 'leaderboard',
        url: process.env.LEADERBOARD_SERVICE,
      },
      {
        name: 'profile',
        url: process.env.PROFILE_SERVICE,
      },
      {
        name: 'leaving',
        url: process.env.LEAVING_SERVICE,
      },
      {
        name: 'payroll',
        url: process.env.PAYROLL_SERVICE,
      },
      {
        name: 'recruiting',
        url: process.env.RECRUITING_SERVICE,
      },
      {
        name: 'employee-details',
        url: process.env.EMPLOYEE_DETAILS_SERVICE,
      },
      {
        name: 'articles',
        url: process.env.ARTICLES_SERVICE,
      },
      {
        name: 'comments',
        url: process.env.COMMENTS_SERVICE,
      },
      {
        name: 'documents',
        url: process.env.DOCUMENTS_SERVICE,
      },
      {
        name: 'reactions',
        url: process.env.REACTIONS_SERVICE,
      },
    ],
  }),
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const apolloServer = new ApolloServer({
  gateway,
  introspection: true,
});

async function context({ req }) {
  return {
    headers: req.headers,
  };
}

async function startServer() {
  await apolloServer.start();
  app.use('/graphql', expressMiddleware(apolloServer, { context: context }));

  const port = process.env.PORT || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/graphql`);
  });
  server.on('error', console.error);
}

startServer();
