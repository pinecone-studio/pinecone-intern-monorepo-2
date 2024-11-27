import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type User {
    _id: ID!
    name: String!
    email: String!
    bio: String!
    age: Int!
    gender: String!
    interests: [String!]
    photos: [String!]
    profession: String!
    schoolWork: [String!]
    createdAt: Date!
    updatedAt: Date!
  }

  input RegisterEmailInput {
    email: String!
  }

  input RegisterOtpInput {
    email: String!
    otp: Int!
  }
  input RegisterPasswordInput {
    email: String!
    otp: Int!
    password: String!
  }
  type RegisterResponse {email:String!}


  type Mutation {
    registerEmail(input: RegisterEmailInput!): RegisterResponse!
    registerOtp(input: RegisterOtpInput!): RegisterResponse!
    registerPassword(input: RegisterPasswordInput!): RegisterResponse!
  }
`;
