import gql from "graphql-tag";

export const typeDefs = gql`
  type Like {
    _id: ID!
    sender: User!
    receiver: User!
    createdAt: Date
    updatedAt: Date
 }
 type Query {  
    getAllLikes: [Like!]!
    getLikesFromUser(userId: ID!): [Like!]!
    getLikesToUser(userId: ID!): [Like!]!
 }
 type Mutation {
    createLike(sender: ID!, receiver: ID!): Like!
 }
`;