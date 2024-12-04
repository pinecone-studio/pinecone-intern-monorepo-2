import { gql } from 'apollo-server-cloud-functions';

export const typeDefs = gql`
  type Comment {
    _id: ID!
    postId: String!
    commentText: String!
    commentedUser: User!
    reply: String
    commentLike: String
    createdAt: Date!
    updatedAt: Date!
  }
  input CreateCommentInput {
    postId: String!
    commentText: String!
  }

  input UpdateCommentInput {
    _id: String!
    commentText: String!
  }

  type Query {
    getComments(postId: String!): [Comment!]!
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment!
    deleteComment(_id: ID!): Comment!
    updateComment(input: UpdateCommentInput!): Comment!
  }
`;
