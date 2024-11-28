/* eslint-disable no-secrets/no-secrets */
import gql from 'graphql-tag';

export const typeDefs = gql`
  type FollowInfo {
    _id: ID!
    followerId: ID!
    followingId: ID!
    createdAt: Date
    updatedAt: Date
    status: String
  }

  type Mutation {
    sendFollowReq(followerId: ID!, followingId: ID!, status: String): FollowInfo!
  }
`;
