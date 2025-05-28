import gql from 'graphql-tag';

export const concertDef = gql`
  type Concert {
    id: ID!
    title: String!
    description: String!
    thumbnailUrl: String!
    artists: [String!]!
    featured: Boolean!
    ticket: [Ticket!]!
    createdAt: Date!
    updatedAt: Date!
    venue: Venue!
    schedule: [Schedule!]!
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
  type Mutation {
    createConcert(input: CreateConcertInput!): Response!
  }
`;
