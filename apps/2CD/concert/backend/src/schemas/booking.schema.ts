import gql from 'graphql-tag';

export const bookingDef = gql`
  scalar Date

  type BookedTicket {
    ticket: Ticket!
    quantity: Int!
  }

  enum bookingStatus {
    PENDING
    REJECTED
    COMPLETED
  }

  type Booking {
    _id: ID!
    user: User!
    concert: Concert!
    tickets: [BookedTicket!]!
    status: bookingStatus!
    totalAmount: Int!
    createdAt: Date!
    updatedAt: Date!
  }
  input UserBookingsInput {
    userId: ID!
    page: Int!
  }

  type Query {
    getUserBooking(input: UserBookingsInput!): [Booking!]!
  }
`;
