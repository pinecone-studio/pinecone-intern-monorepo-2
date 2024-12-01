import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type User {
    _id: ID!
    name: String!
    email: String!
    opt: Int!
    bio: String!
    age: Int!
    gender: String!
    interests: [String!]
    photos: [String!]
    profession: String!
    schoolWork: [String!]
    createdAt: Date!
    updatedAt: Date!
  }

  input RegisterEmailInput {
    email: String!
  }

  type RegisterResponse {
    email: String!
  }
  input ForgetPasswordInput {
    email: String!
  }

  type Mutation {
    registerEmail(input: RegisterEmailInput!): RegisterResponse!
    forgetPassword(input: ForgetPasswordInput!): String!
  }
`;
