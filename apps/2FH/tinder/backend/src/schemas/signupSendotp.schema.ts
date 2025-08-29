import { gql } from 'graphql-tag';

export const SignupSendOtpTypeDefs = gql`
  type Mutation {
    signupSendOtp(email: String!): SignupSendOtpResponse!
    signUpVerifyOtp(email: String!, otp: String!): SignUpVerifyOtpResponse!
  }

  type SignupSendOtpResponse {
    input: String!
    output: String!
  }

  type SignUpVerifyOtpResponse {
    input: String!
    output: String!
  }
`;
