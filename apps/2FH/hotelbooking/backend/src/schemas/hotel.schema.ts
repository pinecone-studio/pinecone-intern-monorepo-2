import { gql } from 'apollo-server-express';

export const hotelSchemaTypeDefs = gql`
  type Success {
    success: Boolean!
    message: String!
  }

  enum Amenity {
    POOL
    GYM
    RESTAURANT
    BAR
    WIFI
    PARKING
    FITNESS_CENTER
    BUSINESS_CENTER
    MEETING_ROOMS
    CONFERENCE_ROOMS
    ROOM_SERVICE
    AIR_CONDITIONING
    AIRPORT_TRANSFER
    FREE_WIFI
    FREE_PARKING
    FREE_CANCELLATION
    SPA
    PETS_ALLOWED
    SMOKING_ALLOWED
    LAUNDRY_FACILITIES
  }

  type Policy {
    checkIn: String!
    checkOut: String!
    specialCheckInInstructions: String!
    accessMethods: [String!]!
    childrenAndExtraBeds: String!
    pets: String!
  }

  type OptionalExtras {
    youNeedToKnow: String!
    weShouldMention: String!
  }

  type Faq {
    question: String!
    answer: String!
  }

  type Hotel {
    id: ID!
    name: String!
    description: String!
    images: [String!]!
    stars: Int!
    phone: String!
    rating: Float!
    city: String!
    country: String!
    location: String!
    amenities: [Amenity!]!
    languages: [String!]!
    policies: [Policy!]!
    optionalExtras: [OptionalExtras!]!
    faq: [Faq!]!
  }

  input HotelInput {
    name: String!
    description: String!
    images: [String!]!
    stars: Int!
    phone: String!
    rating: Float!
    city: String!
    country: String!
    location: String!
    languages: [String!]!
    amenities: [Amenity!]!
    policies: [PolicyInput!]!
    optionalExtras: [OptionalExtrasInput!]
    faq: [FaqInput!]
  }

  input UpdateHotelInput {
    name: String
    description: String
    images: [String!]
    stars: Int
    phone: String
    rating: Float
    city: String
    country: String
    location: String
    languages: [String!]
    amenities: [Amenity!]
    policies: [PolicyInput!]
    optionalExtras: [OptionalExtrasInput!]
    faq: [FaqInput!]
  }

  input PolicyInput {
    checkIn: String!
    checkOut: String!
    specialCheckInInstructions: String!
    accessMethods: [String!]!
    childrenAndExtraBeds: String!
    pets: String!
  }

  input OptionalExtrasInput {
    youNeedToKnow: String!
    weShouldMention: String!
  }

  input FaqInput {
    question: String!
    answer: String!
  }

  type Query {
    hotels: [Hotel!]!
    hotel(id: ID!): Hotel!
    hotelsByCity(city: String!): [Hotel!]!
    hotelsByRating(rating: Float!): [Hotel!]!
    hotelsByStars(stars: Int!): [Hotel!]!
    hotelsByAmenity(amenity: Amenity!): [Hotel!]!
  }

  type Mutation {
    createHotel(hotel: HotelInput!): Success!
    updateHotel(id: ID!, hotel: UpdateHotelInput!): Success!
    deleteHotel(hotelId: ID!): Success!
  }
`;
