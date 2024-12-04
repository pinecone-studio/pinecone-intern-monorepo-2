import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type User {
    _id: ID!
    name: String!
    email: String!
    otp: Int!
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
  input CheckEmailInput {
    email: String!
  }

  type Mutation {
    registerEmail(input: RegisterEmailInput!): RegisterResponse!
    checkEmail(input: CheckEmailInput!): RegisterResponse!
  }
`;
