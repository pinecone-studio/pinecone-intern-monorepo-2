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
    followingId: User!
    createdAt: Date!
    updatedAt: Date!
    status: FollowStatus!
  }

  type FollowingInfo {
    followingId: User!
  }

  type Mutation {
    sendFollowReq(followerId: ID!, followingId: ID!): FollowInfo!
  }

  type Query {
    seeFollowings(followerId: ID!): [FollowingInfo!]!
  }
`;
