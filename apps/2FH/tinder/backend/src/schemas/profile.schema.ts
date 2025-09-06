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
  type LikeProfile {
    id: ID!
    userId: ID!
    name: String!
    bio: String!
    interests: [String!]!
    profession: String!
    work: String!
    images: [String!]!
    dateOfBirth: String!
  }

  type MatchProfile {
    id: ID!
    userId: ID!
    name: String!
    bio: String!
    interests: [String!]!
    profession: String!
    work: String!
    images: [String!]!
    dateOfBirth: String!
  }
  type Profile {
    id: ID!
    userId: ID!
    name: String!
    gender: Gender!
    interestedIn: Gender!
    bio: String!
    interests: [String!]!
    profession: String!
    work: String!
    images: [String!]!
    dateOfBirth: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    likes: [LikeProfile!]!
    matches: [MatchProfile!]!
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
    interestedIn: Gender!
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
    interestedIn: Gender
    bio: String
    interests: [String!]
    profession: String
    work: String
    images: [String!]
    dateOfBirth: String
  }

  type DebugMatchData {
    profileName: String!
    totalMatches: Int!
    totalLikes: Int!
    matchAnalysis: [MatchAnalysis!]!
  }

  type MatchAnalysis {
    matchId: ID!
    matchedUserName: String!
    userLikedMatch: Boolean!
    matchLikedUser: Boolean!
    matchRecordExists: Boolean!
    isValid: Boolean!
    reason: String!
  }

  type DebugMatchesResponse {
    success: Boolean!
    message: String!
    data: DebugMatchData
  }

  type Query {
    getProfile(userId: ID!): Profile!
    getAllProfiles: [Profile!]!
    debugMatches(userId: ID!): DebugMatchesResponse!
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): ProfileResponse!
    updateProfile(input: UpdateProfileInput!): ProfileResponse!
    matchProfiles(userId: ID!, targetUserId: ID!): ProfileResponse!
  }
`;
