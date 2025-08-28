import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar JSON

  scalar Date

  enum Response {
    Success
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;
