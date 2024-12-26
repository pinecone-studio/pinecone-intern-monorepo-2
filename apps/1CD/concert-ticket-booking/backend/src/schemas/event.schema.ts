import gql from 'graphql-tag';

export const typeDefs = gql`
  type Event {
    _id: ID!
    name: String!
    description: String!
    scheduledDays: [String!]!
    mainArtists: [Artist!]!
    guestArtists: [Artist]
    products: [Product!]!
    image: String!
    discount: Int!
    venue: Venue!
    priority: String!
    category: [ID!]!
  }

  type Product {
    _id: ID!
    scheduledDay: Date!
    ticketType: [TicketType!]!
  }
  type Artist {
    name: String!
  }

  type TicketType {
    _id: ID!
    zoneName: String!
    soldQuantity: Int!
    totalQuantity: Int!
    unitPrice: Int!
    discount: Int
    additional: String
  }
  scalar Date

  input TicketTypeInput {
    zoneName: String!
    totalQuantity: Int!
    unitPrice: Int!
    discount: Int
    additional: String
  }

  input EventInput {
    name: String!
    description: String!
    mainArtists: [ArtistInput!]!
    guestArtists: [ArtistInput]
    ticketType: [TicketTypeInput!]!
    image: String!
    discount: Int
    venue: ID!
    category: [ID!]!
    dateRange: DateRangeInput!
    time: TimeInput!
  }
  input ArtistInput {
    name: String!
  }
  input DateRangeInput {
    from: Date!
    to: Date
  }

  input TimeInput {
    hour: String!
    minute: String!
  }

  input EventPriorityUpdateInput {
    priority: String!
  }
  input EventUpdateInput {
    name: String
    description: String
    mainArtists: [String]
    guestArtists: [String]
    products: [ProductInput]
    image: String
    discount: Int
    venue: ID
    category: [ID]
  }
  input ProductInput {
    _id: ID!
    scheduledDay: Date!
    ticketType: [TicketTypeInput!]!
  }

  type Response {
    message: String!
  }
  input EventsFilter {
    q: String
    date: String
    artist: String
  }
  type RelatedEventResponse {
    eventDetail: Event!
    relatedEvents: [Event!]!
  }

  type Query {
    getEventById(_id: ID!): Event!
    getEvents(filter: EventsFilter): [Event]!
    getSpecialEvent: [Event!]!
    getRelatedEvents(eventId: String!): RelatedEventResponse!
  }

  type Mutation {
    createEvent(input: EventInput!): Response!
    updateEventPriority(_id: ID!, input: EventPriorityUpdateInput!): Event!
    deleteEvent(_id: ID!): Response!
    updateEvent(_id: ID!, event: EventUpdateInput): Event!
    deleteLastEvent: Response!
  }
`;
