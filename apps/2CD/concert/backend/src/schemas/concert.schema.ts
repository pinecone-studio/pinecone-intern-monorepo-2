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
  input UpdateConcert {
    id: ID!
    title: String
    description: String
    artists: [ID!]
    ticket: [CreateTicketInput!]
    thumbnailUrl: String
    schedule: [ScheduleInput!]
    venueId: ID
    featured: Boolean
  }
  type Mutation {
    createConcert(input: CreateConcertInput!): Response!
    updateConcert(input: UpdateConcert!): Response!
    deleteConcert(input: UpdateConcert!): Response!
  }
`;
