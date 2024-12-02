import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date

  type BookingType {
    _id: String
    userId: String
    roomId: String
    hotelId: String
    checkInDate: Date
    checkOutDate: Date
    totalPrice: Int!
    status: bookingStatus
  }
  input BookingInput {
    userId: String
    roomId: String
    hotelId: String
    checkInDate: Date
    checkOutDate: Date
    totalPrice: Int!
    status: bookingStatus
  }

  enum bookingStatus {
    booked
    checkedIn
    checkedOut
    cancelled
  }
  type Mutation {
    addNewBooking(input: BookingInput!): BookingType!
  }
`;
