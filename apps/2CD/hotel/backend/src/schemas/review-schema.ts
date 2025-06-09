import gql from 'graphql-tag';

export const typeDefs = gql`
  type Review {
    id: ID!
    user: User!
    hotel: Hotel!
    comment: String!
    star: Int!
    createdAt: String!
    updatedAt: String!
  }

  type MostReviewedHotel {
    hotel: Hotel!
    reviewCount: Int!
    averageRating: Float!
  }

  enum BookingStatus {
    PENDING
    CONFIRMED
    CANCELLED
    COMPLETED
  }

  input ReviewInput {
    user: ID!
    hotel: ID!
    comment: String!
    star: Int!
  }

  type Query {
    reviews: [Review!]!
    reviewsByUser(userId: ID!): [Review!]!
    reviewsByHotel(hotelId: ID!): [Review!]!
    mostReviewedHotels(limit: Int): [MostReviewedHotel!]!
  }

  type Mutation {
    createReview(input: ReviewInput!): Review!
    updateReview(id: ID!, input: ReviewInput!): Review!
  }
`;
