import gql from 'graphql-tag';

export const otpDef = gql`
  type OTP {
    user: User!
    otp: String!
  }
`;
