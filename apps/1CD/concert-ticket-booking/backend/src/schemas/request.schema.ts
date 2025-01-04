import gql from 'graphql-tag';

export const typeDefs = gql`
  type Request {
    _id: ID!
    eventId: ID!
    orderId: ID!
    bankAccount: String!
    bankName: String!
    accountOwner: String!
    phoneNumber: String!
    totalPrice: Int!
    status: String!
    createdAt: Date!
    updatedAt: Date!
  }
  type Query {
    getRequests: [Request!]!
  }
`;
