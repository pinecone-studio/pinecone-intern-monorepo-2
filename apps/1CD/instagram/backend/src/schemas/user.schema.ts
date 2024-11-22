/* eslint-disable no-secrets/no-secrets */
import gql from 'graphql-tag';

export const typeDefs = gql`
  type User {
    _id: ID!
    userName: String!
    fullName: String!
    email: String!
    phone: String
    bio: String
    gender: String
    profileImg: String
    accountVisibility: String
    followerCount: Int
    followingCount: Int
    createdAt: Date
    updatedAt: Date
    otp: String
  }
  input SignupInput {
    email: String!
    password: String!
    userName: String!
    fullName: String!
  }

  type Mutation {
    signup(input: SignupInput!): User!
  }
`;
