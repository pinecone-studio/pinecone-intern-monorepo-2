import gql from 'graphql-tag';
import { typeDefs as HotelsTypeDefs } from './hotels.schema';
import { typeDefs as RoomTypeDefs } from './room.schema';
import { typeDefs as UserTypeDefs } from './user.schema';

export const typeDefs = gql`
  scalar Date
  ${HotelsTypeDefs}
  ${RoomTypeDefs}
  ${UserTypeDefs}

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
  type BookingsType {
    _id: String
    userId: User
    roomId: Room
    hotelId: String
    checkInDate: Date
    checkOutDate: Date
    totalPrice: Int!
    status: bookingStatus
  }
  enum bookingStatus {
    booked
    cancelled
    completed
  }
  type Mutation {
    addNewBooking(input: BookingInput!): BookingType!
    updateBookingStatus(_id: ID!): bookingStatus!
  }

  type Query {
    getBooking(_id: ID): ReturnBooking!
    getBookingFindByUserId(userId: ID): [ReturnBooking!]!
    getBookings: [BookingsType!]!
  }
`;
