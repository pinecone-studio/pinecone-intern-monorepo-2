import { gql } from 'graphql-tag';

export const otpDefs = gql`
  scalar Date
  scalar JSON

  type MessageResponse {
    message: String!
  }
  input VerifyOtpInput {
    email: String!
    otp: String!
  }

  type Mutation {
    sendOtp(email: String!): MessageResponse!
    verifyOtp(input: VerifyOtpInput!): MessageResponse!
  }
`;
