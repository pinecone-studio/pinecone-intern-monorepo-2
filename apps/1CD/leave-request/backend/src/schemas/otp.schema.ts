import gql from "graphql-tag";

export const UserTypeDefs = gql`
  type OTP {
    _id: ID!,
    otp: String!,
    email: String!,
    expirationDate: Date!
  }

  type Mutation{
    createsOTP(email: String!):OTP 
  }
`;
