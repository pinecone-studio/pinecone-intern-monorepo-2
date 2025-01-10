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
  input ChangePasswordInput {
    oldPassword: String!
    newPassword: String!
  }
  input VerifyOtpInput {
    email: String!
    otp: String!
  }
  input RecoverPasswordInput {
    password: String!
    resetToken: String!
  }
  input UpdateUserRole {
    email:String!
    role:String!
  }
  type Query {
    getMe: User!
  }
  type Response {
    message: String!
  }
  type Mutation {
    signUp(email: String!, password: String!): User!
    login(input: LoginInput!): AuthResponse!
    updateUser(input: UpdateInput!): User!
    verifyUserEmail(email: String!): Response!
    changePassword(input: ChangePasswordInput!): Response!
    verifyOtp(input: VerifyOtpInput!): Response!
    recoverPassword(input: RecoverPasswordInput!): Response!
    updateUserRole(input: UpdateUserRole!): User!
  }
`;
