import gql from 'graphql-tag';

export const typeDefs = gql`
 scalar Date
scalar JSON

enum Response {
  Success
}

`;
