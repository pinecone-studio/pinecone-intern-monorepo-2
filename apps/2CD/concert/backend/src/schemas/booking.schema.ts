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
    id: ID!
    user: User!
    concert: Concert!
    tickets: [BookedTicket!]!
    status: bookingStatus!
    totalAmount: Int!
    createdAt: Date!
    updatedAt: Date!
  }
`;
