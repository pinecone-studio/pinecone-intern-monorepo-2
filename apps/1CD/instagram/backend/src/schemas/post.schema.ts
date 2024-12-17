import { gql } from 'apollo-server-cloud-functions';

export const typeDefs = gql`
  type Post {
    _id: ID!
    user: User!
    description: String
    images: [String!]!
    lastComments: [String]
    commentCount: Int
    likeCount: Int
    updatedAt: Date
    createdAt: Date
  }

  input UpdatePostInput {
    _id: ID!
    description: String
    images: [String]
  }

  type Query {
    getMyPosts: [Post!]!
  }

  type Query {
    getMyFollowingsPosts: [Post!]!
  }

  type Mutation {
    createPost(description: String, images: [String!]!): Post!
    updatePost(input: UpdatePostInput!): Post!
    deletePost(_id: String!): Post!
  }
`;
