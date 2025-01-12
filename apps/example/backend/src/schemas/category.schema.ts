import gql from "graphql-tag";

export const typeDefs = gql`
  type Category {
    _id: ID!
    name: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type Query {
    getCategories: [Category!]!
  }
`;
