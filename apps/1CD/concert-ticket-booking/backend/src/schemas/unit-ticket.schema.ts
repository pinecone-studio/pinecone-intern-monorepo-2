import gql from 'graphql-tag';

export const typeDefs = gql`
  type UnitTicket {
    _id: ID!
    ticketId: ID!
    eventId: Event!
    orderId: Order!
    status: String!
  }

  type Query {
    getUnitTicket(ticketId: String!): UnitTicket!
  }
`;
