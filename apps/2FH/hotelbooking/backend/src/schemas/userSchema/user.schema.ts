import { gql } from 'graphql-tag';

export const userDefs = gql`
  scalar Date
  scalar JSON
  enum Role {
    admin
    user
  }

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String
    role: Role!
    dateOfBirth: String!
  }

  input CreateUserInput {
    firstName: String
    lastName: String
    email: String!
    password: String!
    role: Role
    dateOfBirth: String
  }

  input UpdateUserInput {
    _id: String!
    firstName: String
    lastName: String
    email: String
    password: String
    role: Role
    dateOfBirth: String
  }

  input deleteUser {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    role: Role
    dateOfBirth: String
  }

  input UserEmail {
    email: String!
  }
  input UserId {
    _id: ID!
  }

  input InputUserType {
    _id: ID
    firstName: String
    lastName: String
    email: String
    password: String
    role: Role
    dateOfBirth: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(input: deleteUser): User!
  }

  type Query {
    getUserById(input: UserId!): User!
    getUserByEmail(input: UserEmail!): User!
    getUsers(input: InputUserType!): [User!]!
  }
`;
