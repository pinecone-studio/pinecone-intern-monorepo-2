import gql from 'graphql-tag';

export const bookingDef = gql`
  scalar Date

  type BookedTicket {
    ticketId: ID!
    quantity: Int!
    price:Int!
  }

  type GetBookedTicketDetail {
    ticketId: ID!
    quantity: Int!
    ticketDetails: Ticket!
  }

  enum BookingStatus {
    PENDING
    REJECTED
    COMPLETED
  }

  type Booking {
    id: ID!
    user: User!
    concert: Concert!
    tickets: [BookedTicket!]!
    status: BookingStatus!
    totalAmount: Int!
    createdAt: Date!
    updatedAt: Date!
  }

  input CreateBookingInput {
    userId: ID!
    concertId: ID!
    tickets: [CreateBookedTicketInput!]!
  }

  input CreateBookedTicketInput {
    ticketId: ID!
    quantity: Int!
    price: Int!
  }
  type Mutation {
    createBooking(input: CreateBookingInput!): Response!
  }
`;
