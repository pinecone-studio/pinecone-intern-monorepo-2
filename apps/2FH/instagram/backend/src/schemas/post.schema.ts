import gql from 'graphql-tag';

export const PostTypeDefs = gql`
  scalar Date

  type Post {
    _id: ID!
    author: ID!
    image: [String!]!
    caption: String
    likes: [ID!]!
    comments: [Comment!]!
    createdAt: Date!
    updatedAt: Date!
  }

  input CreatePostInput {
    image: [String!]!
    caption: String
  }
  input updateCommentByLikesInput {
    likes: [ID!]!
  }

  type Mutation {
    createPost(author: ID!, input: CreatePostInput!): Post!
    deletePost(_id: ID!, userId: ID!): Post!
    updatePostByLikes(_id: ID!, input: updateCommentByLikesInput!): Post!
    updatePostByCaption(_id: ID!, caption: String!): Post!
  }
  type Query {
    GetPostById(_id: ID!): Post!
    getPostsByFollowingUsers: [Post!]!
    getPostsByAuthor(author: ID!): [Post!]!
  }
`;
