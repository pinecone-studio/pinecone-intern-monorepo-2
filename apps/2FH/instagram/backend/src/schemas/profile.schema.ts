import { gql } from 'graphql-tag';

export const ProfileTypeDefs = gql`
  scalar Date

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  type Profile {
    id: ID!
    fullName: String!
    userName: String!
    bio: String!
    gender: Gender!
    profileImage: String
    createdAt: Date!
    updatedAt: Date!
  }

  input UpdateProfileInput {
    fullName: String
    userName: String
    bio: String
    gender: Gender
    profileImage: String
  }

  type Query {
    getMyProfile: Profile!
  }

  type Mutation {
    updateMyProfile(input: UpdateProfileInput!): Profile!
  }
`;
