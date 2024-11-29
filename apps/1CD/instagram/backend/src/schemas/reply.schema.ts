import { gql } from 'apollo-server-cloud-functions';

export const typeDefs = gql`
  type Reply {
    _id: ID!
    user: String!
    comment:String!
    description: String
    lastComments: String
    commentCount: Int
    likeCount: Int
    updatedAt: String
    createdAt: String
  }
  input replyInput {
    description: String!
    userID:String!
    commentID:String!
  }

  type Mutation {
    createReply(input: replyInput!): Reply!
    updateReply(userID:String!): Reply!
  }
`;
