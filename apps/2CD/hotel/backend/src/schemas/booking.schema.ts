import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar JSON
  scalar Date

  enum BookingStatus {
    PENDING
    CONFIRMED
    CANCELLED
    COMPLETED
  }

  input BookingInput {
    totalPrice: Float!
    bookStatus: BookingStatus!
    startDate: Date!
    endDate: Date!
    user: String!
    room: String!
  }

  input UpdateBookingInput {
    totalPrice: Float!
    bookStatus: BookingStatus!
  }

  type Booking {
    id: ID!
    totalPrice: Float!
    bookStatus: BookingStatus!
    startDate: Date!
    endDate: Date!
    user: String!
    room: String!
  }

  extend type Mutation {
    CreateBooking(input: BookingInput!): Booking
    updateBooking(id: ID!, input: UpdateBookingInput!): Booking
  }

  type Query {
    getBooking(id: ID!): Booking
  }
`;
