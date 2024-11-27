import gql from 'graphql-tag';

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    password: String!
    role: String
    phoneNumber: String
    otp: String
    passwordResetToken: String
    passwordResetTokenExpire: String
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
  input UpdateInput {
    phoneNumber: String!
    email: String!
  }
  type Mutation {
    signUp(email: String!, password: String!): User!
    login(input: LoginInput!): AuthResponse!
    updateUser(input: UpdateInput!): User!
  }
`;
