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
    attraction: String!
  }

  input RegisterEmailInput {
    email: String!
  }

  input checkEmailInput {
    email: String!
  }

  input VerifyOtpInput {
    email: String!
    otp: Int!
  }
  input createPasswordInput {
    email: String!
    otp: Int!
    password: String!
  }

  type RegisterEmailResponse {
    email: String!
  }

  input CreateUserInput {
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

  input CreatePassInput {

    email:String!
    password:String!
  } 


  type Mutation {
    registerEmail(input: RegisterEmailInput!): RegisterEmailResponse!
    verifyOtp(input: VerifyOtpInput!): RegisterEmailResponse!

    createPassword(input:CreatePassInput!):RegisterEmailResponse!
    resendOtp(input:RegisterEmailInput!): RegisterEmailResponse!
    createUser(input: CreateUserInput!):User!
    updateUser(email: String!, name: String!, bio: String!, interests: [String!], profession: String!,schoolWork: [String!]):User!
    checkEmail(input: checkEmailInput!): RegisterEmailResponse!
    updateAttraction(email: String!, attraction: String!): User!
  }
`;
