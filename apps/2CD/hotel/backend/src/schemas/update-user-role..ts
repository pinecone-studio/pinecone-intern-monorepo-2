import { gql } from 'graphql-tag';

export const adminTypeDefs = gql`
  type User {
    _id: ID!
    email: String!
    phoneNumber: String!
    role: UserRole!
  }

  type Mutation {
    updateUserRoleToAdmin(userId: ID!): User
  }
`;
