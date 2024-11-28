import gql from 'graphql-tag';

export const ticketTypeDefs = gql`
  type Ticket {
    _id: ID!
    scheduledDay: Date!
    ticketType: [ticketType!]!
  }

  type ticketType {
    _id: ID!
    zoneName: String!
    soldQuantity: Int!
    totalQuantity: Int!
    unitPrice: Float!
    discount: Float
    additional: String!
  }

  input TicketTypeInput {
    zoneName: String!
    soldQuantity: Int!
    totalQuantity: Int!
    unitPrice: Float!
    discount: Float
    additional: String!
  }

  type Mutation {
    createTicket(scheduledDay: Date!, input: [TicketTypeInput!]!): Ticket!
  }
`;
