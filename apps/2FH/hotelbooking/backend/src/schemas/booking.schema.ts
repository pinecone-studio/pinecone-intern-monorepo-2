import gql from 'graphql-tag';

export const bookingTypeDefs = gql`
  scalar Date

  enum BookingStatus {
    BOOKED
    COMPLETED
    CANCELLED
  }

  type Booking {
    id: ID!
    userId: ID!
    hotelId: ID!
    roomId: ID!
    checkInDate: Date!
    checkOutDate: Date!
    adults: Int
    children: Int
    status: BookingStatus!
    createdAt: Date
    updatedAt: Date
  }

  input CreateBookingInput {
    userId: ID!
    hotelId: ID!
    roomId: ID!
    checkInDate: Date!
    checkOutDate: Date!
    adults: Int
    children: Int
  }

  input UpdateBookingInput {
    hotelId: ID
    roomId: ID
    status: BookingStatus
    checkInDate: Date
    checkOutDate: Date
    adults: Int
    children: Int
  }

  extend type Query {
    bookings: [Booking!]!
    getBooking(id: ID!): Booking!
    getBookingsByUserId(userId: ID!): [Booking!]!
    getBookingsByHotelId(hotelId: ID!): [Booking!]!
    getBookingsByRoomId(roomId: ID!): [Booking!]!
    getBookingsByCheckInDate(checkInDate: Date!): [Booking!]!
    getBookingsByCheckOutDate(checkOutDate: Date!): [Booking!]!
  }

  extend type Mutation {
    createBooking(input: CreateBookingInput!): Response!
    updateBooking(id: ID!, input: UpdateBookingInput!): Response!
    deleteBooking(id: ID!): Response!
  }
`;

export const mapBookingFieldToGraphQL = (field: string): string => {
  const mapping: Record<string, string> = {
    id: 'ID',
    userId: 'userId',
    hotelId: 'hotelId',
    roomId: 'roomId',
    checkInDate: 'checkInDate',
    checkOutDate: 'checkOutDate',
    adults: 'adults',
    children: 'children',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  };
  return mapping[field] || field;
};

export const mapGraphQLToMongooseBookingField = (field: string): string => {
  const mapping: Record<string, string> = {
    ID: 'id',
    userId: 'user_id',
    hotelId: 'hotel_id',
    roomId: 'room_id',
    checkInDate: 'check_in_date',
    checkOutDate: 'check_out_date',
    adults: 'adults',
    children: 'children',
    status: 'status',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };
  return mapping[field] || field;
};
