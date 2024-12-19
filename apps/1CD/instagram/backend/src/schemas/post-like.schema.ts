import { gql } from 'apollo-server-cloud-functions';

export const typeDefs = gql`
  type PostLike {
    _id: ID!
    user: User!
    post: Post!
    isLike: Boolean!
    createdAt: Date
  }

  type Mutation {
    createPostLike(postId: ID!, isLike: Boolean!): PostLike!
  }
`;
