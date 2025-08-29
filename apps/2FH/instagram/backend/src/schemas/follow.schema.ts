import gql from 'graphql-tag';

export const FollowTypeDefs = gql`
  scalar Date

  enum FollowRequestStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  type FollowRequest {
    _id: ID!
    receiver: User!
    requester: User!
    status: FollowRequestStatus!
    createdAt: Date!
    updatedAt: Date!
  }

  type FollowResponse {
    success: Boolean!
    message: String!
    request: FollowRequest
  }

  type Query {
    getPendingFollowRequests: [FollowRequest!]!
  }

  type Mutation {
    followUser(targetUserId: ID!): FollowResponse!
    acceptFollowRequest(requestId: ID!): FollowResponse!
    rejectFollowRequest(requestId: ID!): FollowResponse!
  }
`;
