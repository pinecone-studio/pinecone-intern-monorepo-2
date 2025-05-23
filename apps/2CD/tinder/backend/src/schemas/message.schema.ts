import gql from 'graphql-tag';

export const typeDefs = gql`
  type Message {
    _id: ID!
    match: Match!
    sender: User!
    content: String!
    read: Boolean!
    createdAt: Date
    updatedAt: Date
  }

  extend type Query {
    getMessages(matchId: ID!): [Message!]!
  }

  extend type Mutation {
    sendMessage(matchId: ID!, content: String!): Message!
    markAsRead(messageId: ID!): Boolean
  }
`;
