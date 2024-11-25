import gql from 'graphql-tag';

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    password: String!
    role: String
    phoneNumber: String
    otp: String
    passwordResetToken: String
    passwordResetTokenExpire: String
    createdAt: Date!
    updatedAt: Date!
  }
  type Mutation {
    signUp(email: String!, password: String!): User!
  }
`;
