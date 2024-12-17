import gql from 'graphql-tag';
import { typeDefs as HotelsTypeDefs } from './hotels.schema';
import { typeDefs as RoomTypeDefs } from './room.schema';

export const typeDefs = gql`
  scalar Date
  ${HotelsTypeDefs}
  ${RoomTypeDefs}

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

  type ReturnBooking {
    _id: String
    userId: String
    roomId: Room
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
  type Query {
    getBooking(_id: ID): ReturnBooking
  }
`;
