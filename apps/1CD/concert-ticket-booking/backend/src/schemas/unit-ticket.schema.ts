import gql from 'graphql-tag';

export const typeDefs = gql`
  type UnitTicket {
    _id: ID!
    productId: Product!
    ticketId: ID!
    eventId: Event!
    orderId: Order!
    status: String!
  }

  type Query {
    getUnitTicket(unitId: String!): UnitTicket!
  }
`;
