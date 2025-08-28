import gql from "graphql-tag";

export const SwipeTypeDefs = gql`
  scalar DateTime

  enum SwipeAction {
  LIKE
  DISLIKE
  SUPER_LIKE
}

enum SwipeResponse {
  SUCCESS
  ERROR
  ALREADY_SWIPED
  MATCH_CREATED
  NO_MORE_PROFILES
}

type Match {
  likeduserId: Profile!
  matcheduserId: Profile!
}

type Swipe {
  id: ID!
  swiperId: ID!
  targetId: ID!
  action: SwipeAction!
  swipedAt: Date!
}

type SwipeResult {
  success: Boolean!
  message: String!
  response: SwipeResponse!
  match: Match
  nextProfile: Profile
}

input SwipeInput {
  swiperId: ID!
  targetId: ID!
  action: SwipeAction!
}

type Query {
  getSwipe(userId: ID!): Profile
}

type Mutation {
  swipe(input: SwipeInput!): SwipeResult!
  undoLastSwipe(userId: ID!): SwipeResponse!
}

`;
