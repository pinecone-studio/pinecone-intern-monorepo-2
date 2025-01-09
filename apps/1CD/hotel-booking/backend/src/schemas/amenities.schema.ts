import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type AmenitiesType {
    _id: ID
    hotelAmenities: [String]
  }
  input AmenityTypeInput {
    _id: ID
    hotelAmenities: [String]
  }
  type Mutation {
    addAmenity(input: AmenityTypeInput!): AmenitiesType!
  }
`;
