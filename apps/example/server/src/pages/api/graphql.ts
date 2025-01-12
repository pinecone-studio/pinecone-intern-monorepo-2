import { buildSubgraphSchema } from '@apollo/subgraph';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { ApolloServer } from 'apollo-server-cloud-functions';
import { resolvers, typeDefs } from '../../graphql';
import { connectToDatabase } from '../../configs/database';
import { GraphQLResolverMap } from '@apollo/subgraph/dist/schema-helper';

connectToDatabase();

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers: resolvers as GraphQLResolverMap<unknown>,
  }),
  introspection: true,
  csrfPrevention: true,
  cache: new InMemoryLRUCache(),
  context: ({ req, res }: { req: Request; res: Response }) => ({
    headers: req.headers,
    req,
    res,
  }),
});

export const config = { api: { bodyParser: false, externalResolver: true } };

const graphqlHandler = server.createHandler();

export default graphqlHandler;
