import gql from 'graphql-tag';

export const UserTypeDefs = gql`
  type User {
    _id: ID!
    email: String!
    userName: String!
    profile: String
    role: String
    position: String!
    supervisor: [ID]
    hireDate: Date
    createdAt: Date
    updatedAt: Date
  }

  type Mutation {
    createUser(email: String!, userName: String!, profile: String!, role: String!, position: String!, supervisor: [ID], hireDate: Date!): User
    updateUserRole(email:String!, role: String!): Role
  }

  type Query {
    findUserByEmail(email: String!): User
  }
`;
