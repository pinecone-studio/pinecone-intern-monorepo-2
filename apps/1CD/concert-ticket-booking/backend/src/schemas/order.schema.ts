import gql from 'graphql-tag';

export const typeDefs = gql`
  type Order {
    _id: ID!
    userId: User!
    eventId: ID!
    ticketId: ID!
    status: String!
    phoneNumber: String!
    email: String!
    ticketType: [TicketType!]!
    createdAt: Date!
    updatedAt: Date!
  }
  input OrderInput {
    eventId: ID!
    ticketId: ID!
    phoneNumber: String!
    email: String!
    ticketType: [MyTicketTypeInput!]!
  }
  input MyTicketTypeInput {
    _id: ID!
    buyQuantity: String!
  }
  input ChangeStatusInput {
    orderId: ID!
    requestId: ID!
  }

  type ChangeStatusResponse {
    message: String!
  }
  type Response {
    message: String!
  }

  type Query {
    getOrder: [Order]!
  }

  type Mutation {
    changeStatus(input: ChangeStatusInput!): ChangeStatusResponse!
    addToCarts(input: OrderInput!): Order!
    paymentTickets(orderId: String!): Response!
    deleteOrder(_id: ID!): Order!
    paymentCheck(orderId: String!): Response!
  }
`;
