/* eslint-disable no-secrets/no-secrets */
import gql from 'graphql-tag';

export const typeDefs = gql`
  type StoryInfo {
    _id: ID!
    userId: ID!
    description: String
    image: String
    createdAt: Date
  }

  input StoryInput {
    userId: ID!
    description: String
    image: String
  }

  type Mutation {
    createStory(input: StoryInput!): StoryInfo!
  }
`;
