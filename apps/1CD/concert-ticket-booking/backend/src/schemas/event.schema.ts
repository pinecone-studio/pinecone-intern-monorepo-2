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
    discount: Float
    venue: ID!
    priority: String!
    category: [ID!]!
  }
  type Ticket {
    _id: ID!
    scheduledDay: Date!
    ticketType: [TicketType!]!
  }

  type TicketType {
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
    ticketType: [TicketTypeInput!]!
  }

  input TicketTypeInput {
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
    discount: Int
    venue: ID!
    category: [ID!]!
  }

  input EventPriorityUpdateInput {
    priority: String!
  }
  input EventUpdateInput {
    name: String
    description: String
    mainArtists: [String]
    guestArtists: [String]
    dayTickets: [TicketInput]
    image: String
    discount: String
    venue: ID
    category: [ID]
  }

  type Response {
    message: String!
  }
  input EventsFilter {
    q: String
    date: String
    artist: String
  }

  type Query {
    getEventById(_id: ID!): Event!
    getEvents(filter: EventsFilter): [Event]!
  }

  type Mutation {
    createEvent(input: EventInput!): Event!

    updateEventPriority(_id: ID!, input: EventPriorityUpdateInput!): Event!

    deleteEvent(_id: ID!): Response!
    updateEvent(_id: ID!, event: EventUpdateInput): Event!
  }
  type Query {
    getSpecialEvent: [Event!]!
  }
`;
