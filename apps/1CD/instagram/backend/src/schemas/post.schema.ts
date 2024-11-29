import { gql } from 'apollo-server-cloud-functions';

export const typeDefs = gql`
  type Post {
    _id: ID!
    user: String!
    description: String
    images: [String!]!
    lastComments: String
    commentCount: Int
    likeCount: Int
    updatedAt: String
    createdAt: String
  }
  input UpdatePostInput {
    _id: ID!

    description: String
    images: [String]
  }

  type Query {
    getMyPosts(userID: String!): [Post!]!
  }

  type Mutation {
    createPost(user: String!, description: String, images: [String!]!): Post!
    updatePost(input: UpdatePostInput!): Post!
    deletePost(_id: String!): Post!
  }
`;
