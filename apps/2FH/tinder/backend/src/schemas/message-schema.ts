import gql from "graphql-tag";

export const messageTypeDefs = gql`
type Message {
  id: ID!
  sender: User        
  receiver: User     
  content: String!     
}
type Query {
  getMessages(senderId: ID, receiverId: ID): [Message!]!
  getMessage(id: ID!): Message
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