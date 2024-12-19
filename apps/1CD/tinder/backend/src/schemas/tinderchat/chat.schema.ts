import gql from 'graphql-tag';

export const typeDefs = gql`
  input TinderChatinput {
    user2: ID!
    content: String
    chatId:ID
  }
  type TinderChatresponse {
    _id: ID!
    content: String
    senderId: ID
    createdAt:Date
    chatId:ID
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
    hasChatted: Boolean!
  }
  type MatchResponse{
    _id:ID!,
    matched:Boolean!
  }
  type UpdateMatchResponse {
    matched:Boolean!
  }

  type Mutation {
    createChat(input:TinderChatinput!): TinderChatresponse!
    updateMatch(input:GetChatInput!):UpdateMatchResponse!
  }
  type Query {
    getChat(input:GetChatInput!): [TinderChatresponse!]!
    getMatch: [MatchedUser]
    getOneUser(input:GetChat!):MatchedUser!
  }
`;
