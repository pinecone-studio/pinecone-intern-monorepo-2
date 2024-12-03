import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type AmenitiesType {
    _id: ID
    name: String
  }
  input AmenityTypeInput {
    _id: ID
    name: String
  }
  type Mutation {
    addAmenity(input: AmenityTypeInput!): AmenitiesType!
  }
`;
