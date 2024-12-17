import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type User {
    _id: ID!
    email: String!
    firstName: String
    lastName: String
    phoneNumber: String
    createdAt: Date!
  }

  type Password {
    password: String!
  }

  type OtpResponse {
    email: String!
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
    email: String
    otp: String
  }

  input OtpInput {
    otp: String!
  }

  input PasswordInput {
    email: String
    password: String!
  }

  type Query {
    getUser: User!
  }

  type Mutation {
    login(input: LoginInput!): AuthResponse!
    verifyOtp(input: SignUpInput!): OtpResponse!
    sendOtp(input: SignUpInput!): OtpResponse!
    setPassword(input: PasswordInput!): User!
  }
`;
