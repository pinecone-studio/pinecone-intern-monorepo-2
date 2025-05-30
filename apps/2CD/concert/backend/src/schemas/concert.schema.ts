import gql from 'graphql-tag';

export const concertDef = gql`
  type Concert {
    id: ID!
    title: String!
    description: String!
    thumbnailUrl: String!
    artists: [Artist!]!
    featured: Boolean!
    ticket: [Ticket!]!
    createdAt: Date!
    updatedAt: Date!
    venue: Venue!
    schedule: [Schedule!]!
    totalProfit: Int!
  }
  input CreateConcertInput {
    title: String!
    description: String!
    artists: [ID!]!
    ticket: [CreateTicketInput!]!
    thumbnailUrl: String!
    schedule: [ScheduleInput!]!
    venueId: ID!
  }
  input GetConcertFilter {
    artist: [ID!]
    title: String
    date: Date
  }
  type Query {
    getConcert(input: GetConcertFilter): [Concert!]!
  }
  type Mutation {
    createConcert(input: CreateConcertInput!): Response!
  }
`;
