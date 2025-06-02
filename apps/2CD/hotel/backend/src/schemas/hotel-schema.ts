import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar JSON

  scalar Date

  enum Response {
    Success
  }

  input AddHotelInput {
    hotelName: String!
    price: Float!
    description: String!
    phoneNumber: String!
    amenities: [String!]
    rooms: [ID!]
    hotelStar: Int
    guestReviews: [ID!]
    bookings: [ID!]
    roomServices: [ID!]
    images: [String!]
  }

  input UpdateHotelInput {
    hotelName: String
    price: Float
    description: String
    phoneNumber: String
    amenities: [String!]
    rooms: [ID!]
    hotelStar: Int
    guestReviews: [ID!]
    bookings: [ID!]
    roomServices: [ID!]
    images: [String!]
  }

  type Hotel {
    id: ID!
    hotelName: String!
    price: Float!
    description: String!
    phoneNumber: String!
    amenities: [String!]
    rooms: [ID!]
    hotelStar: Int
    guestReviews: [ID!]
    bookings: [ID!]
    roomServices: [ID!]
    images: [String!]
    createdAt: String!
    updatedAt: String!
  }

  type Mutation {
    addHotel(input: AddHotelInput!): Hotel!
    updateHotel(id: ID!, input: UpdateHotelInput!): Hotel!
  }

  type Query {
    getAllHotels: [Hotel!]!
    getHotelById(id: ID!): Hotel!
  }
`;
