import gql from 'graphql-tag';

export const userDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String!
    phone: String
    bookings: [Booking!]!
    createdAt: Date!
    updatedAt: Date!
  }
  input UpdateUserInput {
    id: ID!
    email: String
    phone: String
  }
  input UpdatePassInput {
    id: ID!
    password: String!
  }
  type Mutation {
    updateUser(input: UpdateUserInput!): Response!
    updatePass(input: UpdatePassInput!): Response!
  }
`;
