import { gql } from 'apollo-server-cloud-functions';
export const typeDefs = gql`
  type Reply {
    _id: ID!
    userID: String!
    commentID: String!
    description: String
    updatedAt: String
    createdAt: String
  }

  input replyInput {
    description: String!
    userID: String!
    commentID: String!
  }

  input UpdateReplyInput {
    _id: ID!
    description: String!
  }
  type Mutation {
    createReply(input: replyInput!): Reply!
    updateReply(input: UpdateReplyInput!): Reply!
  }
`;
