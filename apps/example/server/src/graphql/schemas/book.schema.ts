import { gql } from 'apollo-server-cloud-functions';

export const bookTypeDefs = gql`
  type Book {
    _id: ID!
    title: String!
    author: Author!
  }

  type Query {
    getBook(_id: ID!): Book!
    getBooks: [Book!]!
  }

  type Mutation {
    createBook(title: String!, authorId: ID!): Book!
    updateBook(_id: ID!, title: String!, authorId: ID!): Book!
    deleteBook(_id: ID!): Book!
  }
`;
