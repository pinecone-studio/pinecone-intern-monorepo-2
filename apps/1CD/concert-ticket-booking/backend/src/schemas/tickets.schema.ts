import gql from 'graphql-tag';

export const ticketsTypeDefs = gql`
  type Product {
    _id: ID!
    scheduledDay: Date!
    ticketType: TicketType!
  }
  type Mutation {
    createTicket(scheduledDay: Date!, input: [TicketTypeInput!]!): Ticket!
  }
`;
