import gql from 'graphql-tag';

export const requestDef = gql`
  type Request {
    id: ID!
    booking: Booking!
    user: User!
    status: requestStatus!
    bank: String!
    bankAccount: String!
    name: String!
    createdAt: Date!
    updatedAt: Date!
  }
  enum requestStatus {
    PENDING
    DONE
  }
`;
