import { gql } from "graphql-tag";

export const passwordResetSchema = gql`
  enum PasswordResetResponse {
    SUCCESS
    ERROR
  }

  type ForgotPasswordResponse {
    status: PasswordResetResponse!
    message: String
  }

  type VerifyOtpResponse {
    status: PasswordResetResponse!
    message: String
  }

  type ResetPasswordResponse {
    status: PasswordResetResponse!
    message: String
  }

  input ForgotPasswordInput {
    email: String!
  }

  input VerifyOtpInput {
    email: String!
    otp: String!
  }

  input ResetPasswordInput {
    email: String!
    newPassword: String!
  }

  type Mutation {
    forgotPassword(input: ForgotPasswordInput!): ForgotPasswordResponse
    verifyOtp(input: VerifyOtpInput!): VerifyOtpResponse
    resetPassword(input: ResetPasswordInput!): ResetPasswordResponse
  }
`;
