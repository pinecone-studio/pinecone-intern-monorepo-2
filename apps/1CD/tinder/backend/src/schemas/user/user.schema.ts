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
    interests: [String!]!
    photos: [String!]!
    profession: String!
    schoolWork: [String!]
    createdAt: Date!
    updatedAt: Date!
    attraction: String
    otpCreatedAt: Date!
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

  type ImageSubmitResponse {
    photos: [String!]!
    email: String!
  }

  input CreatePassInput {
    password: String!
  }

  input BirthdaySubmitInput {
    age: Int!
  }

  input ImageSubmitInput {
    photos: [String!]!
  }

  type ResponseWithtoken {
    token: String!
  }

  input EditProfileInput {
    name: String!
    email: String!
    bio: String!
    age: Int!
    interests: [String!]!
    photos: [String!]!
    profession: String!
    schoolWork: [String!]
    attraction: String
  }
  type ResponseEditProfileInput {
    name: String!
    email: String!
    bio: String!
    age: Int!
    interests: [String!]!
    photos: [String!]!
    profession: String!
    schoolWork: [String!]
    attraction: String
  }

  type Query {
    getMe: User!
  }

  type Mutation {
    # sign up
    registerEmail(input: RegisterEmailInput!): RegisterEmailResponse!
    verifyOtp(input: VerifyOtpInput!): ResponseWithtoken!
    createPassword(input: CreatePassInput!): RegisterEmailResponse!
    resendOtp(input: RegisterEmailInput!): RegisterEmailResponse!
    # sign in
    signIn(email: String!, password: String!): ResponseWithtoken!
    # forget password
    checkEmail(input: checkEmailInput!): RegisterEmailResponse!
    # details
    birthdaySubmit(input: BirthdaySubmitInput!): RegisterEmailResponse!
    updateUser(name: String!, bio: String!, interests: [String!], profession: String!, schoolWork: [String!]): RegisterEmailResponse!
    updateAttraction(attraction: String!): RegisterEmailResponse!
    imageSubmit(input: ImageSubmitInput!): ImageSubmitResponse!
    editProfile(input: EditProfileInput!): ResponseEditProfileInput!
    updateGender(gender: String!): RegisterEmailResponse!
  }
`;
