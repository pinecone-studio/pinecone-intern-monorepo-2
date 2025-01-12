/* eslint-disable no-secrets/no-secrets */
import gql from 'graphql-tag';

export const typeDefs = gql`
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    address: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type AuthResponse {
    user: User!
    token: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    address: String!
    password: String!
  }

  input ChangePasswordInput {
    email: String!
    password: String!
    otp: String!
  }

  input RequestChangePasswordInput {
    email: String!
  }

  type RequestChangePasswordResponse {
    email: String!
  }

  type Query {
    getMe: User!
  }

  type Mutation {
    login(input: LoginInput!): AuthResponse!
    register(input: RegisterInput!): AuthResponse!
    requestChangePassword(input: RequestChangePasswordInput!): RequestChangePasswordResponse!
    changePassword(input: ChangePasswordInput!): Response!
  }
`;
