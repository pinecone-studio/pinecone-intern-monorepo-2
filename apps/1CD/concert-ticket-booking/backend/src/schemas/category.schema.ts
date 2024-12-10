import gql from 'graphql-tag';

export const typeDefs = gql`
  type Category {
    _id: ID!
    name: String!
  }

  type Mutation {
    createCategory(name: String!): Category!
    deleteCategory(id: String!): Category!
  }
  type Query {
    getCategories: [Category!]!
  }
`;
