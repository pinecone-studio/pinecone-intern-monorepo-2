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
    hotel: String!
  }

  input UpdateBookingInput {
    totalPrice: Float!
    bookStatus: BookingStatus!
  }
  type mostBookedHotel {
    hotel: Hotel!
    bookingCount: Int!
  }

  type Booking {
    id: ID!
    totalPrice: Float!
    bookStatus: BookingStatus!
    startDate: Date!
    endDate: Date!
    user: User!
    room: Room!
    hotel: Hotel!
  }

  extend type Mutation {
    CreateBooking(input: BookingInput!): Booking
    updateBooking(id: ID!, input: UpdateBookingInput!): Booking
  }

  type Query {
    getBookingById(id: ID!): Booking
    getAllBookings: [Booking!]!
    mostBookedHotel: [mostBookedHotel!]!
  }
`;
