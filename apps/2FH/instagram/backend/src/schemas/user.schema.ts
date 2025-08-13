import gql from "graphql-tag";

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
    createdAt: Date!
    updatedAt: Date!
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

  type Query {
    getUserById(_id: ID!): User
    getUserByUsername(userName: String!): User
    searchUsers(keyword: String!): [User!]!
    getFollowers(userId: ID!): [User!]!
    getFollowings(userId: ID!): [User!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(_id: ID!, input: UpdateUserInput!): User!
    deleteUser(_id: ID!): Boolean!

    followUser(targetUserId: ID!): Boolean!
    unfollowUser(targetUserId: ID!): Boolean!
  }
`;
