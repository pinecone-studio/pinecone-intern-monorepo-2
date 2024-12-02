import gql from 'graphql-tag';

export const typeDefs = gql`
  type PaymentType {
    _id: ID
    bookingId: ID
    userId: ID
    amount: Int
    paymentMethod: String
    status: PaymentStatus
  }
  enum PaymentStatus {
    paid
    failed
    pending
  }
  input PaymentInput {
    bookingId: ID!
    userId: ID!
    amount: Int!
    paymentMethod: String!
    status: PaymentStatus!
  }
  type Mutation {
    addPayment(input: PaymentInput!): PaymentType!
  }
`;
