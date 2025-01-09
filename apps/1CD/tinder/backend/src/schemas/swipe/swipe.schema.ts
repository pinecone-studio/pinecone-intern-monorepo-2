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
  type ResponseofGetUser{
    swipedUserImg:String
    userImg:String!
    swipedName:String
  }
  

  type Query {
    getUsers: [User!]!,
    getMatchedUser(matchedUser:String!):ResponseofGetUser!
  }

  type Mutation {
    swipeUser(input: SwipeInput!): ResponseOfSwipe!
  }
`;
