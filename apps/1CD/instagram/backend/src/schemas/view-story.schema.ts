/* eslint-disable no-secrets/no-secrets */
import gql from 'graphql-tag';

export const typeDefs = gql`
  type ViewStory {
    _id: ID!
    user: ID!
    storyId: ID!
    viewed: Boolean!
    createdAt: Date
  }

  input ViewStoryInput {
    user: ID!
    storyId: ID!
    viewed: Boolean!
  }

  type Mutation {
    createViewStory(input: ViewStoryInput!): ViewStory!
  }
`;
