import gql from "graphql-tag";

export const typeDefs = gql`
  type Save {
    _id: ID!
    user: User!
    product: Product!
    createdAt: Date!
    updatedAt: Date!
  }

  type Query {
    getSavedProducts: [Save!]!
  }

  type Mutation {
    toggleSaveProduct(productId: ID!): Response!
  }
`;
