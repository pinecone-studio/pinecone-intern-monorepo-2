import gql from 'graphql-tag';

export const typeDefs = gql`
  type OrderProduct {
    product: Product!
    quantity: Int!
    priceWhenOrdered: Int!
  }

  type Order {
    _id: ID!
    user: User!
    products: [OrderProduct!]!
    createdAt: Date!
    updatedAt: Date!
  }

  input OrderProductInput {
    product: ID!
    quantity: Int!
    priceWhenOrdered: Int!
  }

  type Query {
    getOrders: [Order!]!
  }

  type Mutation {
    createOrder(products: [OrderProductInput!]!): Response!
  }
`;
