// schema.ts эсвэл typeDefs.ts
import { gql } from "graphql-tag";

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
    createdAt: DateTime!
    updatedAt: DateTime!
    likes: [Profile!]!
    matches: [Profile!]!
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
  }
`;