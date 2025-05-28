import gql from 'graphql-tag';

export const typeDefs = gql`
  type Match {
    _id: ID!
    users: [User!]!
    createdAt: Date
  }

  extend type Query {
    getMyMatches: [Match!]!
    getMatchById(id: ID!): Match
  }
`;
