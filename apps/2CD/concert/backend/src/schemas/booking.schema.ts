import gql from 'graphql-tag';

export const bookingDef = gql`
  scalar Date

  type BookedTicket {
    ticketId: ID!
    quantity: Int!
  }

  enum bookingStatus {
    PENDING
    REJECTED
    COMPLETED
  }

  type Booking {
    id: ID!
    user: User!
    tickets: [BookedTicket!]!
    status: bookingStatus!
    createdAt: Date!
    updatedAt: Date!
  }

  
  input CreateBookingInput {
    userId: ID!
    concertId: ID!,
    tickets : [CreateTicketInput!]!
  } 

  input CreateTicketInput {
    ticketId : ID!
    quantity : Int!
  }
    type Mutation {
    createBooking(input: CreateBookingInput!): Booking!
  }
`;
