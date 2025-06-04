import gql from 'graphql-tag';

const OtpTypeDef = gql`
  enum OTPPurpose {
    login
    signup
    reset_password
    change_phone
    change_password
    change_email
  }

  type OTP {
    id: ID!
    email: String!
    otp: String!
    purpose: OTPPurpose!
    isVerified: Boolean!
    createdAt: String!
  }
  input OtpInput {
    email: String!
    otp: String!
  }

  type OtpResponse {
    success: Boolean!
    message: String!
  }
  type Mutation {
    sendOtp(input: OtpInput!): OtpResponse!
  }
`;
export default OtpTypeDef;
