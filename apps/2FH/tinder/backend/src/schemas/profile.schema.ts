// schema.ts эсвэл typeDefs.ts
import { gql } from 'graphql-tag';

export const ProfileTypeDefs = gql`
  scalar DateTime

  enum Gender {
    male
    female
    both
  }

  enum ProfileResponse {
    SUCCESS
    ERROR
  }

  enum SwipeAction {
    LIKE
    DISLIKE
  }

  type Profile {
    id: ID!
    userId: ID!
    name: String!
    gender: Gender!
    bio: String!
    interests: [String!]!
    profession: String!
    work: String!
    images: [String!]!
    dateOfBirth: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    likes: [Profile!]!
    matches: [Profile!]!
  }

  type Swipe {
    id: ID!
    swiperId: ID!
    targetId: ID!
    action: SwipeAction!
  }

  input CreateProfileInput {
    userId: ID!
    name: String!
    gender: Gender!
    bio: String!
    interests: [String!]!
    profession: String!
    work: String
    images: [String!]!
    dateOfBirth: String!
  }

  input UpdateProfileInput {
    userId: ID!
    name: String
    gender: Gender
    bio: String
    interests: [String!]
    profession: String
    work: String
    images: [String!]
    dateOfBirth: String
  }

  type Query {
    getProfile(userId: ID!): Profile!
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): ProfileResponse!
    updateProfile(input: UpdateProfileInput!): ProfileResponse!
    matchProfiles(userId: ID!, targetUserId: ID!): ProfileResponse!
  }
`;
