import gql from 'graphql-tag';

export const typeDefs = gql`
  type Event {
    _id: ID!
    name: String!
    description: String!
    scheduledDays: [String!]!
    mainArtists: [String!]!
    guestArtists: [String!]!
    dayTickets: [Ticket!]!
    image: String!
    discount: String
    venue: ID!
    category: [ID!]!
  }
  type Ticket {
    _id: ID!
    scheduledDay: Date!
    ticketType: [ticketType!]!
  }

  type ticketType {
    _id: ID!
    zoneName: String!
    soldQuantity: Int!
    totalQuantity: Int!
    unitPrice: Float!
    discount: Float
    additional: String!
  }
  input TicketInput {
    scheduledDay: Date!
    ticketType: [ticketTypeInput!]!
  }

  input ticketTypeInput {
    zoneName: String!
    soldQuantity: Int!
    totalQuantity: Int!
    unitPrice: Float!
    discount: Float
    additional: String!
  }

  input EventInput {
    name: String!
    description: String!
    mainArtists: [String!]!
    guestArtists: [String!]!
    dayTickets: [TicketInput!]!
    image: String!
    discount: String
    venue: ID!
    category: [ID!]!
  }

  type Mutation {
    createEvent(input: EventInput!): Event!
  }
`;
