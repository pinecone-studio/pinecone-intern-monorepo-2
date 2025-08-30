import gql from 'graphql-tag';

export const StoryTypeDefs = gql`
  scalar Date
    type Story {
        _id: ID!
        author: User!
        image: String!
        viewers: [User!]!
        createdAt: Date!
        expiredAt: Date!
    }

  type Story {
    _id: ID!
    author: User
    image: String!
    viewers: [User!]!
    createdAt: Date!
    expiredAt: Date!
  }


  input CreateStoryInput {
    image: String!
  }

  type Query {
    getStoryByUserId(author: ID!): [Story!]!
    getStoryById(_id: ID!): Story
    # Get current user's active stories
    getMyStories: [Story!]!
    # Get all active stories from followed users
    getActiveStories: [Story!]!
  }

  type Mutation {
    createStory(input: CreateStoryInput!): Story!
    deleteStory(_id: ID!): Boolean!
    viewStory(_id: ID!): Story!
  }
`;
