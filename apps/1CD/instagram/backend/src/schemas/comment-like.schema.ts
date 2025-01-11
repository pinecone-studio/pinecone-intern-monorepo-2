import { gql } from 'apollo-server-cloud-functions';

export const typeDefs = gql`
  type CommentLike {
    _id: ID!
    likedUser: User!
    comment: Comment!
    isLike: Boolean!
    createdAt: Date
  }

  type Query {
    getCommentLikes(commentId: ID!): [CommentLike]!
    getCommentLike(commentId: ID!): CommentLike
  }

  type Mutation {
    createCommentLike(commentId: ID!, isLike: Boolean!): CommentLike!
    deleteCommentLike(commentLikeId: ID!): CommentLike!
  }
`;
