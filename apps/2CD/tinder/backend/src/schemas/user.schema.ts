import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date

  type User {
    _id: ID!
    name: String!
    email: String!
    clerkId: String!
    profile: Profile
    matches: [Match]
    messages: [Message]
  }

  type Profile {
    _id: ID!
    userId: ID!
    bio: String
    age: Int
    gender: String
    location: String
    photos: [String]
  }

  type Match {
    _id: ID!
    users: [User!]!
    messages: [Message]
    createdAt: Date
  }

  type Message {
    _id: ID!
    match: Match!
    sender: User!
    content: String!
    createdAt: Date
  }

  type Query {
    me(clerkId: String!): User
    getUserById(id: ID!): User
    getAllUsers: GetAllUsersResponse
    getSwipeFeed(limit: Int!, excludeIds: [ID!]!, userId: ID!): [User]
    getDislikesFromUser(userId: ID!): [Dislike!]!
    getDislikesToUser(userId: ID!): [Dislike!]!
    getProfile(userId: ID!): Profile
  }

  type GetAllUsersResponse {
    users: [User]
    matches: [Match]
    messages: [Message]
  }

  type Mutation {
    registerUser(input: RegisterUserInput!): User
    login(email: String!, password: String!): String
    updateUser(input: UpdateUserInput!): User
    createDislike(sender: ID!, receiver: ID!): Dislike!
    deleteUser: Boolean
    createProfile(input: CreateProfileInput!): Profile
    updateProfile(input: UpdateProfileInput!): Profile
  }

  input RegisterUserInput {
    name: String!
    email: String!
    password: String!
    clerkId: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
  }

  input CreateProfileInput {
    userId: ID!
    bio: String
    age: Int
    gender: String
    location: String
    photos: [String]
  }

  input UpdateProfileInput {
    userId: ID!
    bio: String
    age: Int
    gender: String
    location: String
    photos: [String]
  }
`;
