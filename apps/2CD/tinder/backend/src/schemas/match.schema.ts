import gql from 'graphql-tag';

export const typeDefs = gql`
  type Match {
    _id: ID!
    users: [User!]!
    createdAt: Date
  }

  type Response {
    success: Boolean!
    message: String!
  }

  type Mutation {
    unMatched(_id: ID!): Response!
  }
  extend type Query {
    getMyMatches: [Match!]!
  }

  extend type Mutation {
    unMatched(_id: String!): Response!
  }
`;
