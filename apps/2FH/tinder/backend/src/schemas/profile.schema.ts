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
    createdAt: DateTime
    updatedAt: DateTime
    likes: [Profile!]!
    matches: [Profile!]!
  }



  type UserInfo {
userId: ID!
name: String!
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

  type Match {
    likedUserId: UserInfo
    matchedUserId: UserInfo
  }

  input CreateProfileInput {
    userId: ID!
    name: String!
    gender: Gender!
    bio: String!
    interests: [String!]!
    profession: String!
    work: String!
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
    getAllProfiles:[Profile!]!
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): ProfileResponse!
    updateProfile(input: UpdateProfileInput!): ProfileResponse!
    matchProfiles(userId: ID!, targetUserId: ID!): ProfileResponse!
  }
`;
