import gql from 'graphql-tag';

export const typeDefs = gql`
  enum Response {
    Success
  }
  input SwipeInput {
    swipedUser: String!
    type: String!
  }

  type Query {
    getUsers: [User!]!
  }

  type Mutation {
    swipeUser(input: SwipeInput!): Response!
  }
`;
