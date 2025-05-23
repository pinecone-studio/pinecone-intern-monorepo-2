import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date

  type User {
    _id: ID!
    name: String!
    email: String!
    images: [String!]!
    bio: String
    age: Int!
    gender: String!
    lookingFor: String!
    interests: [String!]!
    profession: String
    education: String
    isCertified: Boolean!
    likes: [User!]!
    dislikes: [User!]!
    matches: [User!]!
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    me: User
    getUserById(id: ID!): User
    getAllUsers: [User!]!
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!, age: Int!, gender: String!, lookingFor: String!): User
    login(email: String!, password: String!): String
    likeUser(targetUserId: ID!): User
    dislikeUser(targetUserId: ID!): User
    updateProfile(input: UpdateProfileInput!): User
  }

  input UpdateProfileInput {
    name: String
    bio: String
    profession: String
    education: String
    interests: [String!]
  }
`;
