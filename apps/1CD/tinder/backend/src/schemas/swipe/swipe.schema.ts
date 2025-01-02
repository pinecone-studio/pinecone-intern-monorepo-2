import gql from 'graphql-tag';

export const typeDefs = gql`
  type ResponseOfSwipe {
    swiped:String,
    matched:Boolean,
    matchedWith:String,
  }
  input SwipeInput {
    swipedUser: String!
    type: String!
  }

  type Query {
    getUsers: [User!]!
  }

  type Mutation {
    swipeUser(input: SwipeInput!): ResponseOfSwipe!
  }
`;
