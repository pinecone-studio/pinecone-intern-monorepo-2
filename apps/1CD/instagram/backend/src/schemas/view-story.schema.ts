/* eslint-disable no-secrets/no-secrets */
import gql from 'graphql-tag';

export const typeDefs = gql`
  type WatchedUser {
    user: ID!
    isViewed: Boolean!
  }

  type WatchedUserWithDetails {
    user: User!
    isViewed: Boolean!
  }

  type ViewStory {
    _id: ID!
    watchedUsers: [WatchedUser!]!
    storyId: ID!
    createdAt: Date
  }

  type ViewStoryWithUser {
    _id: ID!
    watchedUsers: [WatchedUserWithDetails!]!
    storyId: ID!
    createdAt: Date
  }

  input ViewStoryInput {
    user: ID!
    storyId: ID!
    isViewed: Boolean!
  }

  type Mutation {
    createViewStory(input: ViewStoryInput!): ViewStory!
  }

  type Query {
    getStoryViewer(storyId: ID!): ViewStoryWithUser!
  }
`;
