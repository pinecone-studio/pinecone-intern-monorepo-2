import { gql } from 'graphql-tag';

export const userDefs = gql`
  scalar Date
  scalar JSON
  enum Role {
    admin
    user
  }

  type User {
    firstName: String!
    lastName: String!
    email: String!
    password: String
    role: Role!
    dateOfBirth: String!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    role: Role
    dateOfBirth: String!
  }

  input getUserOne {
    email: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
  }

  type Query {
    getUserOne(input: getUserOne!): User!
    getUsers: [User!]!
  }
`;
