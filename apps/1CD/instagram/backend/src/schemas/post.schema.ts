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

  type UserPost {
    _id: ID!
    user: ID!
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
    getMyFollowingsPosts: [Post!]!
    getPost(_id: ID!): Post!
    getUserPosts(user: ID!): [UserPost]
    getPostByPostId(postId: ID!): Post
  }

  type Mutation {
    createPost(description: String, images: [String!]!): Post!
    updatePost(input: UpdatePostInput!): Post!
    deletePost(_id: String!): Post!
  }
`;
