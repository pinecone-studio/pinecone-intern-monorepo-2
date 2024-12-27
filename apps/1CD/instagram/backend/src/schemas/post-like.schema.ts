import { gql } from 'apollo-server-cloud-functions';

export const typeDefs = gql`
  type PostLike {
    _id: ID!
    user: User!
    post: Post!
    isLike: Boolean!
    createdAt: Date
  }

  type Query {
    getPostLikes(postId: ID!): [PostLike]!
    getPostLike(postId: ID!): PostLike
  }

  type Mutation {
    createPostLike(postId: ID!, isLike: Boolean!): PostLike!
    deletePostLike(postLikeId: ID!): PostLike!
  }
`;
