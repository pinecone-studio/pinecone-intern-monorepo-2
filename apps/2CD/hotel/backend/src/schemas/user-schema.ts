import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  enum UserRole {
    USER
    ADMIN
  }

  type User {
    _id: ID!
    clerkId: String!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    bookings: [ID!]
    reviews: [ID!]
    role: UserRole
    createdAt: String!
    updatedAt: String
  }

  extend type Query {
    getUserById(id: ID!): User
    getAllUsers: [User!]!
  }
`;
