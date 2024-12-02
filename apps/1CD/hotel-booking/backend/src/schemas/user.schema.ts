import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type User {
    _id: ID!
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String!
    createdAt: Date!
  }

  type AuthResponse {
    user: User!
    token: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input SignUpInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    password: String!
  }

  type Query {
    getUser: User!
  }

  type Mutation {
    login(input: LoginInput!): AuthResponse!
    signUp(input: SignUpInput!): AuthResponse!
  }
`;
