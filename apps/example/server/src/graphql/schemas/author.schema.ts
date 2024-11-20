import { gql } from 'apollo-server-cloud-functions';

export const authorTypeDefs = gql`
  type Author {
    _id: ID!
    name: String!
  }

  type Query {
    getAuthor(_id: ID!): Author!
    getAuthors: [Author!]!
    getAuthorsByName( name: String): [Author!]!
  }

  type Mutation {
    createAuthor(name: String!): Author!
    updateAuthor(_id: ID!, name: String!): Author!
    deleteAuthor(_id: ID!): Author!
  }
`;
