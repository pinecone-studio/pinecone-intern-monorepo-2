import gql from 'graphql-tag';

export const ticketTypeDefs = gql`
  input RequestTypeInput {
    eventId: ID!
    bankAccount: String!
    bankName: String!
    accountOwner: String!
    phoneNumber: String!
    totalPrice: Int!
  }

  input CancelTicketTypeInput {
    orderId: ID!
    bankDatas: RequestTypeInput!
  }

  type CancelTicketResponse {
    message: String!
  }

  type Mutation {
    cancelTicket(input: CancelTicketTypeInput!): CancelTicketResponse!
  }
  input BuyTicket {
    ticketId: String!
    venueId: String!
  }
  type BuyTicketResponse {
    findVenue: Venue!
    findTicket: Product!
  }
  type Query {
    getTicketWithVenue(input: BuyTicket!): BuyTicketResponse!
  }
`;
