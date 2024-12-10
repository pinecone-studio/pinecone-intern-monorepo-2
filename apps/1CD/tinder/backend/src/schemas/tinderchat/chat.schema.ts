import gql from 'graphql-tag';

export const typeDefs = gql`
  input TinderChatinput {
    participants: [ID!]!
    content: String
    senderId: ID
  }
  type TinderChatresponse {
    _id: ID!
    content: String
    senderId: ID
  }
  input GetChat {
    _id: ID!
  }

  type Mutation {
    createChat(input: TinderChatinput!): TinderChatresponse!
  }
  type Query {
    getChat(input: GetChat!): [TinderChatresponse!]!
  }
`;
