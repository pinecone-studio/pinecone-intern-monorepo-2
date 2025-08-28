import gql from 'graphql-tag';

export const CommentTypeDefs = gql`
  scalar Date
  type Comment {
    _id: ID!
    author: ID!
    postId: ID!
    replyId: [ID!]!
    content: String!
    likes: [ID!]!
  }
  input createCommentInput {
    content: String!
    author: ID!
    postId: ID!
  }
  input CommentInput {
    content: String!
  }
  input updateByLikeInput {
    likes: [ID!]!
  }
  input updateByReplyInput {
    reply: [ID!]!
  }
  type Mutation {
    createComment(input: createCommentInput!): Comment!
    deleteComment(_id: ID!,userId:ID!): Comment!
    updateCommentByContent(_id: ID!, input: CommentInput!, userId: ID!): Comment!
    updateCommentByLikes(_id: ID!, input: updateByLikeInput): Comment!
    updateCommentByReply(_id: ID!, input: updateByReplyInput): Comment!
  }
`;
