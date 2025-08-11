import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs]);

// Export the schema as a string for GraphQL Code Generator
export const schema = `
  scalar JSON

  scalar Date

  enum Response {
    Success
  }

  type Query {
    sampleQuery: String!
  }

  type Mutation {
    sampleMutation: String!
  }
`;
