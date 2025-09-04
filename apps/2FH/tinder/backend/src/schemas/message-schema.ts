import { gql } from "graphql-tag";

export const messageTypeDefs = gql`
  type Message {
    id: ID!
    content: String!
    senderId: ID!
    receiverId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    messages(conversationId: ID!): [Message!]!
    message(id: ID!): Message
  }

  type Mutation {
    sendMessage(input: SendMessageInput!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  input SendMessageInput {
    content: String!
    senderId: ID!
    receiverId: ID!
  }
`;