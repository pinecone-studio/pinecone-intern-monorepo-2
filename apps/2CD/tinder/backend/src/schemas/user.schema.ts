import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date

  type User {
    _id: ID!
    clerkId: String
    name: String
    email: String
    password: String!
    profile: Profile
    matches: [Match!]!
    likesFrom: [Like!]!
    likesTo: [Like!]!
    messages: [Message!]!
  }

  type Query {
    me(clerkId: String!): User
    getUserById(id: ID!): User
    getAllUsers: [User]
  }

  type Mutation {
    registerUser(input: RegisterUserInput!): User
    login(email: String!, password: String!): String
    updateUser(input: UpdateUserInput!): User
  }

  input RegisterUserInput {
    name: String!
    email: String!
    password: String!
    age: Int
    gender: String
    lookingFor: String
    images: [String]
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
  }
`;
