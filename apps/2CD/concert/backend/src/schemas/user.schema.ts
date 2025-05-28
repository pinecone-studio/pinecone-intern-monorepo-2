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
`;
