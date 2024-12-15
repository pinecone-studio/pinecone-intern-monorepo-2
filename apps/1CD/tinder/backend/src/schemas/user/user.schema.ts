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
    otp: String!
  }
  input createPasswordInput {
    password: String!
  }

  type RegisterEmailResponse {
    email: String!
  }

  input CreatePassInput {
    password: String!
  }

  input BirthdaySubmitInput {
    age: Int!
  }

  type ResponseWithtoken {
    token: String!
  }

  type Mutation {
    # sign up
    registerEmail(input: RegisterEmailInput!): RegisterEmailResponse!
    verifyOtp(input: VerifyOtpInput!): ResponseWithtoken!
    createPassword(input: CreatePassInput!): RegisterEmailResponse!
    resendOtp(input: RegisterEmailInput!): RegisterEmailResponse!
    # sign in
    signIn(email:String!, password:String!):ResponseWithtoken!
    # forget password
    checkEmail(input: checkEmailInput!): RegisterEmailResponse!
    # details
    birthdaySubmit(input: BirthdaySubmitInput!): RegisterEmailResponse!
    updateUser(name: String!, bio: String!, interests: [String!], profession: String!, schoolWork: [String!]): RegisterEmailResponse!
    updateAttraction(attraction: String!): RegisterEmailResponse!
  }
`;
