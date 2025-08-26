import gql from 'graphql-tag';

export const ReplyTypeDefs = gql`
  scalar Date

  type Reply {
    _id: ID!
    author: ID!
    CommentId: ID!
    replyId: [ID!]!
    content: String!
    likes: [ID!]!
    createdAt: Date!
    updatedAt: Date!
  }

  input ReplyInput {
    content: String!
  }
  input updateByLikesInput {
    likes: [ID!]!
  }
  input updateByReplyInput {
    reply: [ID!]!
  }
  type Mutation {
    createReply(input: ReplyInput!): Reply!
    deleteReply(_id: ID!, userId: ID!): Boolean!
    updateReplyByContent(_id: ID!, input: ReplyInput!, userId: ID!): Reply!
    updateReplyByLikes(_id: ID!, input: updateByLikesInput): Reply!
    updateReplyByReply(_id: ID!, input: updateByReplyInput): Reply!
  }
`;
