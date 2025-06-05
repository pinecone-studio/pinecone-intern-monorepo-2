import { gql } from 'graphql-tag';

export const adminTypeDefs = gql`
  enum UserRole {
    USER
    ADMIN
  }

  type User {
    _id: ID!
    email: String!
    role: UserRole!
  }

  type Mutation {
    updateUserRoleToAdmin(userId: ID!): User
  }
`;