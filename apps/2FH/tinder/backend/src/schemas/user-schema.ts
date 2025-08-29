import { gql } from "graphql-tag";

export const UserTypeDefs = gql`
 
  type User {
    id: ID!                    
    email: String!           
    password: String!
    createdAt: String!         
    updatedAt: String!         
  }
 
 
  enum UserResponse {
  SUCCESS
    ERROR
  }
 
  type Query {
    users: [User!]!            
    user(id: ID!): User        
  }
type LoginResponse {
    status: UserResponse!
    message: String
    token: String
    user: User
  }
 
  type Mutation {             
    createUser(input: CreateUserInput!): UserResponse!
    updateUser(id: ID!, input: UpdateUserInput!): UserResponse!
    deleteUser(id: ID!): UserResponse!    
     login(email: String!, password: String!): LoginResponse                     
  }
 
 
  input CreateUserInput {         
    email: String!
    password: String!
  }
 
  input UpdateUserInput {     
    email: String
    password: String
  }
`;