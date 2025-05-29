import gql from 'graphql-tag';

export const userTypeDefs = gql`
  enum UserRole {
    USER
    ADMIN
  }

  type User {
    _id: ID!
    email: String!
    phoneNumber: String!
    bookings: [ID!]!
    reviews: [ID!]!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    email: String!
    password: String!
    phoneNumber: String!
    role: UserRole
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  extend type Query {
    getUserById(id: ID!): User
    getAllUsers: [User!]!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`;
