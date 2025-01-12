import gql from 'graphql-tag';

export const typeDefs = gql`
  type Product {
    _id: ID!
    name: String!
    price: Int!
    description: String!
    images: [String!]!
    category: Category!
    createdAt: Date!
    updatedAt: Date!
  }

  input QueryOptions {
    filter: JSON
  }

  type Query {
    getProducts(options: QueryOptions): [Product!]!
    getProductById(_id: ID!): Product!
  }
`;
