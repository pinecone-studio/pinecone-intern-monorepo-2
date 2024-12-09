import gql from 'graphql-tag';

export const ticketTypeDefs = gql`
  type Ticket {
    _id: ID!
    scheduledDay: Date!
    ticketType: [TicketType!]!
  }

  type Mutation {
    createTicket(scheduledDay: Date!, input: [TicketTypeInput!]!): Ticket!
  }
`;
