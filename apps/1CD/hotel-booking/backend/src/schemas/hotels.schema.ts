import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type Hotel {
    createdAt: Date
    _id: ID
    hotelName: String
    description: String
    starRating: Int
    userRating: Int
    phoneNumber: Int
    images: [String]
    hotelAmenities: [String]
    location: String
    roomsAveragePrice: Int
  }

  input HotelInput {
    hotelName: String!
    description: String!
    starRating: Int!
    userRating: Int!
    phoneNumber: Int!
    images: [String]
  }

  input HotelFilterInput {
    starRating: Int
    userRating: Int
    checkInDate: Date
    checkOutDate: Date
  }
  type Mutation {
    addHotelGeneralInfo(input: HotelInput!): Hotel!
    updateHotelLocation(location: String!, _id: String!): Hotel!
    updateHotelImages(images: [String!]!, _id: String!): Hotel!
    updateHotelGeneralInfo(_id: String!, input: HotelInput!): Hotel!
  }

  input AdminHotelFilter {
    starRating: Int
    userRating: Int
    hotelName: String
    roomType: String
  }
  type Query {
    getHotel(_id: ID!): Hotel!
    getHotels(input: AdminHotelFilter): [Hotel!]!
  }
`;
