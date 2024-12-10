import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type Hotel {
    createdAt: Date
    _id: ID!
    hotelName: String
    description: String
    starRating: Int
    userRating: Int
    phoneNumber: Int
  }
  input HotelInput {
    hotelName: String!
    description: String!
    starRating: Int!
    userRating: Int!
    phoneNumber: Int!
  }
  type Mutation {
    addHotelGeneralInfo(input: HotelInput!): Hotel!
    updateHotelLocation(location: String!, _id: String!): Hotel!
  }
  type Query {
    getHotel(_id: ID!): Hotel!
    getHotels: [Hotel!]!
  }
`;
