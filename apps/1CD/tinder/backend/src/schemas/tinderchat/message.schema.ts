import gql from 'graphql-tag';

export const typeDefs = gql`
  type Message {
    _id: ID!
    chatId: ID
    content: String
    senderID: ID
  }
`;
