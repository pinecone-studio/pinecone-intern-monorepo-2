import gql from "graphql-tag";

export const typeDefs = gql`
  type Like {
    _id: ID!
    from: User!
    to: User!
    createdAt: Date
    updatedAt: Date
 }
 type Query {  
    getAllLikes: [Like!]!
    getLikesFromUser(userId: ID!): [Like!]!
    getLikesToUser(userId: ID!): [Like!]!
 }
 type Mutation {
    createLike(from: ID!, to: ID!): Like!
 }
`;