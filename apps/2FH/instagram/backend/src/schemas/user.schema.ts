import gql from 'graphql-tag';

export const UserTypeDefs = gql`
  scalar Date

  enum Gender {
    FEMALE
    MALE
    OTHER
  }

  type User {
    _id: ID!
    fullName: String!
    userName: String!
    email: String
    phoneNumber: String
    bio: String
    profileImage: String
    gender: Gender!
    isPrivate: Boolean!
    isVerified: Boolean!
    posts: [ID!]!
    stories: [Story!]!
    followers: [User!]!
    followings: [User!]!
    searchHistory: [User!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  type DeleteUserResponse {
    success: Boolean!
    message: String!
    deletedUser: User!
  }

  type ClearSearchHistoryResponse {
    success: Boolean!
    message: String!
  }

  input CreateUserInput {
    fullName: String!
    userName: String!
    email: String
    phoneNumber: String
    password: String!
    bio: String
    profileImage: String
    gender: Gender!
  }

  input UpdateUserInput {
    fullName: String
    userName: String
    email: String
    phoneNumber: String
    bio: String
    profileImage: String
    gender: Gender
    isPrivate: Boolean
  }

  input LoginInput {
    identifier: String!
    password: String!
  }

  input ForgotPasswordInput {
    identifier: String!
  }

  input ResetPasswordInput {
    identifier: String!
    otp: String!
    newPassword: String!
  }

  input OtpStorageInput {
    identifier: String!
    otp: String!
  }

  input SendVerificationEmailInput {
    email: String!
  }

  type Query {
    getUserById(_id: ID!): User
    getUserByUsername(userName: String!): User
    
    searchUsers(keyword: String!): [User!]!
    getUserSearchHistory(userId: ID!): [User!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    loginUser(input: LoginInput!): LoginResponse!
    forgotPassword(input: ForgotPasswordInput!): Boolean!
    resetPassword(input: ResetPasswordInput!): Boolean!
    verifyOTP(identifier: String!, otp: String!): Boolean!
    otpStorage(input: OtpStorageInput!): Boolean!
    sendVerificationEmail(input: SendVerificationEmailInput!): Boolean!
    verifyEmailOTP(email: String!, otp: String!): Boolean!

    updateUser(_id: ID!, input: UpdateUserInput!): User!
    deleteUser(userId: ID!): DeleteUserResponse!
    
    addToSearchHistory(searchedUserId: ID!): User!
    removeFromSearchHistory(searchedUserId: ID!): User!
    clearSearchHistory: ClearSearchHistoryResponse!
  }
`;