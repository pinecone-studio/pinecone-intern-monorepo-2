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
`;
