import gql from "graphql-tag";

export const messageTypeDefs = gql`
type Message {
  id: ID!
  sender: User        
  receiver: User     
  content: String!     
  createdAt: String!   
}

type Profile {
  name: String
  work: String
  images: [String!]
}

type Conversation {
  user: User!           # User basic info
  profile: Profile!     # Profile info (name, work, images)
  messages: [Message!]! # Хоёр хэрэглэгчийн хоорондох мессежүүд
}

type Query {
  getMessages(senderId: ID, receiverId: ID): [Message!]!
  getConversations(userId: ID!): [Conversation!]!
  getMessagesBetweenUsers(userId1: ID!, userId2: ID!): [Message!]!
}

input SendMessageInput {
  senderId: ID!
  receiverId: ID!
  content: String!
}

type Mutation {
  sendMessage(input: SendMessageInput!): Message!
}
`;
