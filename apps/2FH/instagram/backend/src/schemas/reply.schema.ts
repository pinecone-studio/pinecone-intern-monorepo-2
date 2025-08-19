import gql from "graphql-tag";

 export const ReplyTypeDefs = gql`
  scalar Date

 type Reply {
 _id:ID!
 author:ID!
 CommentId:ID!
 replyId:[ID!]!
 content:String!
 likes:[ID!]!
 createdAt: Date!
 updatedAt: Date!
 }

 input ReplyInput{
 content:String!
 }

 type Mutation{
createReply(input:ReplyInput!):Reply!
deleteReply(_id:ID!):Boolean!
updateReply(_id:ID!, input:ReplyInput!):Reply!
 }
 `