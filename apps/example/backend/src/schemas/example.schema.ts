import gql from 'graphql-tag';

export const typeDefs = gql`
  type Person {
    name: String!
    age: Int!
    gender: String!
  }
`;
