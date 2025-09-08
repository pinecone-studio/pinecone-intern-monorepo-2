import gql from 'graphql-tag';

export const PostTypeDefs = gql`
  scalar Date
  type User {
    _id: ID!
    userName: String!
    profileImage: String!
  }
  type Comment {
    _id: ID!
    content: String!
    author: ID!
    likes: [User!]!
    createdAt: Date!
    updatedAt: Date!
  }
  type Post {
    _id: ID!
    author: User!
    image: [String!]!
    caption: String
    likes: [User!]!
    comments: [Comment!]!
    createdAt: Date!
    updatedAt: Date!
  }

  input CreatePostInput {
    image: [String!]!
    caption: String
  }
  input updatePostByLikesInput {
    likes: [ID!]!
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    deletePost(_id: ID!): Post!
    updatePostByLikes(_id: ID!, input: updatePostByLikesInput!): Post!
    updatePostByCaption(_id: ID!, caption: String!): Post!
  }
  type Query {
    GetPostById(_id: ID!): Post!
    getPostsByFollowingUsers: [Post!]!
    getPostsByAuthor(author: ID!): [Post!]!
  }
`;

