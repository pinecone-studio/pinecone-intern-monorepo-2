import gql from 'graphql-tag';

export const typeDefs = gql`
  type Chat {
    _id: ID!
    participants: [ID!]!
  }
`;
