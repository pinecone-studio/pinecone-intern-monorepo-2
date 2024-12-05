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
    ticketType: [ticketsTypeInput!]!
  }

  input ticketsTypeInput {
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
    priority: String!
  }

  input EventPriorityUpdateInput {
    priority: String!
  }

  type Mutation {
    createEvent(input: EventInput!): Event!
    updateEventPriority(_id: ID!, input: EventPriorityUpdateInput!): Event!
  }
  type Query {
    getSpecialEvent: [Event!]!
  }
`;
