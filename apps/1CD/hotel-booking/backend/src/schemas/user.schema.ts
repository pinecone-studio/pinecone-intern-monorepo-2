import gql from 'graphql-tag';

export const typeDefs = gql`
  enum Response {
    Success
  }

  enum emergencyStatusEnum {
    Spouse
    Parents
    Sibling
    Friend
    Partner
    Child
    Neighbor
    Roommate
  }

  scalar Date
  type User {
    _id: ID!
    email: String!
    firstName: String
    lastName: String
    dateOfBirth: Date
    phoneNumber: String
    emergencyContact: String
    emergencyStatus: emergencyStatusEnum
    createdAt: Date!
  }

  type Password {
    password: String!
  }

  type AuthResponse {
    user: User!
    token: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input SignUpInput {
    email: String!
    otp: String
  }

  input VerifyOtpInput {
    email: String!
    otp: String!
  }

  input OtpInput {
    otp: String!
  }

  input PasswordInput {
    email: String!
    password: String!
  }

  input ProfileInput {
    firstName: String
    lastName: String
    dateOfBirth: Date
    phoneNumber: String
    emergencyContact: String
    emergencyStatus: emergencyStatusEnum
  }

  type Query {
    getUser: User!
  }

  type Mutation {
    login(input: LoginInput!): AuthResponse!
    verifyOtp(input: VerifyOtpInput!): Response!
    sendOtp(input: SignUpInput!): Response!
    setPassword(input: PasswordInput!): Response!
    verifyEmail(input: SignUpInput!): Response!
    updatePassword(input: PasswordInput!): Response!
    updateProfile(input: ProfileInput!): User!
  }
`;
