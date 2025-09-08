import gql from 'graphql-tag';

export const CommentTypeDefs = gql`
  scalar Date
  type Comment {
    _id: ID!
    author: ID!
    parentId: ID!
    parentType: String!
    content: String!
    likes: [User!]!
    comments: [Comment!]!
    createdAt: Date!
    updatedAt: Date!
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
    createCommentOnPost(postId: ID!, content: String!): Comment!
    createReplyOnComment(commentId: ID!, content: String!): Comment!
    deleteComment(_id: ID!, userId: ID!): Comment!
    updateCommentByContent(_id: ID!, input: CommentInput!, userId: ID!): Comment!
    updateCommentByLikes(_id: ID!, input: updateByLikeInput): Comment!
  }
  type Query {
    getCommentById(_id: ID!): Comment!
    getCommentByParentId(parentId: ID!): [Comment!]!
  }
`;
