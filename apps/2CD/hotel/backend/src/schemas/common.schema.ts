import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar JSON

  scalar Date

  enum Response {
    Success
  }

  type Query {
    sampleQuery: String!
    getAllHotels: [Hotel!]!
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
    createdAt: String!
    updatedAt: String!
  }
  type Mutation {
    sampleMutation: String!
    addHotel(input: AddHotelInput!): Hotel!
  }
`;
