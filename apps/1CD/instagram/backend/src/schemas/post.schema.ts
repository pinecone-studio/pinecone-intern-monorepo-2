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

  type Mutation {
    createPost(user: String!, description: String, images: [String!]!): Post!
  }
`;
