import gql from 'graphql-tag';

export const bookingDef = gql`
  type Booking {
    id: ID!
    user: User!
    tickets: [Ticket!]!
    status: bookingStatus!
    createdAt: Date!
    updatedAt: Date!
  }
  enum bookingStatus {
    PENDING
    REJECTED
    COMPLETED
  }
`;
