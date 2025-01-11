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

  type FollowingInfo {
    followingId: User!
    status: FollowStatus!
  }

  type FollowerInfo {
    followerId: User!
    status: FollowStatus!
  }

  type SuggestUserInfo {
    followerId: User!
    followingId: User!
  }

  type Mutation {
    sendFollowReq(followerId: ID!, followingId: ID!): FollowInfo!
  }

  type Mutation {
    confirmFollowReq(followerId: ID!): FollowInfo!
  }

  type Mutation {
    removeFollower(_id: ID!): FollowInfo!
  }

  type Mutation {
    unfollow(_id: ID!, followerId: ID!): FollowInfo!
  }

  type Mutation {
    removeFollowReqFromNotifyByPrivateFollowingIdUser(followerId: ID!, followingId: ID!): Response!
  }

  type Query {
    seeFollowings(followerId: ID!): [FollowingInfo!]!
  }

  type Query {
    seeFollowers(followingId: ID!): [FollowerInfo!]!
  }

  type Query {
    getFollowStatus(followingId: ID!, followerId: ID!): FollowInfo
  }
  type Query {
    getSuggestUser: [SuggestUserInfo]!
  }
  type Query {
    suggestUser: [SuggestUserInfo]!
  }
  type Query {
    getFollowStatusByFollowingId(followingId: ID!, followerId: ID!): FollowInfo
  }
`;
