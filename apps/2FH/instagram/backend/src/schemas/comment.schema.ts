import gql from "graphql-tag";

 export const CommentTypeDefs = gql`
   scalar Date
   type Comment {
     _id: ID!
     author: ID!
     postId: ID!
     replyId: [ID!]!
     content: String!
     likes: [ID!]!
   }

   input CommentInput {
     content: String!
   }

   type Mutation {
     createComment(input: CommentInput!): Comment!
     deleteComment(_id: ID!): Boolean!
     updateCommentByContent(_id: ID!, input: CommentInput!): Comment!
   }
 `;

 
