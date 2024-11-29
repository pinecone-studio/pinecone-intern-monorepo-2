import gql from 'graphql-tag';

export const typeDefs = gql`
  type Venue {
    _id: ID!
    name: String!
    location: String!
    image: String!
    capacity: String!
    size: String!
  }

  input ArenaInput {
    name: String!
    location: String!
    image: String!
    capacity: String!
    size: String!
  }

  type Mutation {
    createArena(input: ArenaInput!): Venue!
    deleteArena(_id: ID!): Venue!
  }
  type Query {
    getArena: [Venue]
  }
`;
