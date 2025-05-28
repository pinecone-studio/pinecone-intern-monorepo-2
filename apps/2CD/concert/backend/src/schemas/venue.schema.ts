import gql from 'graphql-tag';

export const venueDef = gql`
  type Venue {
    id: ID!
    name: String!
    address: String!
    city: String!
    capacity: Int!
    createdAt: Date!
    updatedAt: Date!
  }
  input VenueInput {
    name: String!
    address: String!
    city: String!
    capacity: Int!
  }
  type Mutation {
    createVenue(input: VenueInput!):Venue!
  }
`;
