/* eslint-disable no-secrets/no-secrets */
import gql from 'graphql-tag';

export const typeDefs = gql`
  enum AccountVisibility {
    PUBLIC
    PRIVATE
  }

  type User {
    _id: ID!
    userName: String!
    fullName: String!
    email: String!
    phone: String
    bio: String
    gender: String
    profileImg: String
    accountVisibility: AccountVisibility!
    followerCount: Int!
    followingCount: Int!
    createdAt: Date!
    updatedAt: Date!
    otp: String
  }

  type AuthResponse {
    user: User!
    token: String!
  }

  input SignupInput {
    email: String!
    password: String!
    userName: String!
    fullName: String!
    accountVisibility: AccountVisibility
  }

  input UpdateInput {
    _id: ID!
    userName: String
    fullName: String
    bio: String
    gender: String
    profileImg: String
    accountVisibility: AccountVisibility
  }

  type Mutation {
    signup(input: SignupInput!): AuthResponse!
    updateUserData(input: UpdateInput!): User!
  }
`;
