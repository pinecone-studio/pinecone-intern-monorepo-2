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
    location: String
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
    location: String
  }

  type Hotel {
    id: ID!
    hotelName: String!
    price: Float!
    description: String!
    phoneNumber: String!
    amenities: [String!]
    rooms: [ID!]
    images: [String!]
    hotelStar: Int
    guestReviews: [ID!]
    bookings: [ID!]
    roomServices: [ID!]
    createdAt: String!
    updatedAt: String!
    location: String!
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
