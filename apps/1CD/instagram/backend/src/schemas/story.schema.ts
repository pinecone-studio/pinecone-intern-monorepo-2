/* eslint-disable no-secrets/no-secrets */
import gql from 'graphql-tag';

export const typeDefs = gql`
  type Story {
    _id: ID!
    userId: ID!
    description: String
    image: String
    createdAt: Date
  }

  type StoryInfo {
    _id: ID!
    userId: User!
    description: String
    image: String
    createdAt: Date
  }

  input StoryInput {
    userId: ID!
    description: String
    image: String
  }

  type Query {
    getMyStory(_id: ID!): StoryInfo!
  }

  type Query {
    getFollowingStories: [StoryInfo!]
  }

  type Query {
    getMyStories: [StoryInfo!]
  }

  type Mutation {
    createStory(input: StoryInput!): Story!
  }
`;
