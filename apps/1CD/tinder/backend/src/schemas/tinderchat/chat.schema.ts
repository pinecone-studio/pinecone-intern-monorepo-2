import gql from 'graphql-tag';

export const typeDefs = gql`
  input TinderChatinput {
    participants: [ID!]!
    content: String
    senderId: ID
    chatId:ID
  }
  type TinderChatresponse {
    _id: ID!
    content: String
    senderId: ID
    createdAt:Date
  }
  input GetChat {
    _id: ID
  }

  input GetChatInput{
    user1:String,
    user2:String
  }
  type MatchedUser {
    _id: ID!
    name: String!
    email: String!
    bio: String!
    age: Int!
    gender: String!
    interests: [String!]
    photos: [String!]
    profession: String!
    schoolWork: [String!]
    createdAt: Date!
    updatedAt: Date!
    attraction: String!
  }

  type Mutation {
    createChat(input: TinderChatinput!): TinderChatresponse!
  }
  type Query {
    getChat(input: GetChatInput!): [TinderChatresponse!]!
    getMatch(input: GetChat!): [MatchedUser!]
  }
`;
