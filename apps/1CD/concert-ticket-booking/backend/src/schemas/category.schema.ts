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
  # type Mutation {
  #   createCategory(input: CreateCategoryInput!): Category!
  #   deleteCategory(_id: ID!): Category!
  # }
`;
