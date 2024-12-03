/* eslint-disable no-secrets/no-secrets */
import gql from 'graphql-tag';

export const typeDefs = gql`
  enum FollowStatus {
    APPROVED
    PENDING
  }

  type FollowInfo {
    _id: ID!
    followerId: ID!
    followingId: ID!
    createdAt: Date!
    updatedAt: Date!
    status: FollowStatus!
  }

  type Mutation {
    sendFollowReq(followerId: ID!, followingId: ID!): FollowInfo!
  }
`;
