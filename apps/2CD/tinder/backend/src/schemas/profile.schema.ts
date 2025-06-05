import gql from 'graphql-tag';

export const typeDefs = gql`
  type Profile {
    _id: ID!
    userId: ID!
    firstName: String!
    bio: String
    age: Int!
    gender: String!
    lookingFor: String!
    interests: [String!]!
    profession: String
    education: String
    isCertified: Boolean!
    images: [String!]!
    likes: [User!]!
    dislikes: [User!]!
    matches: [User!]!
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    getProfile(id: ID!): Profile
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile!
    updateProfile(id: ID!, input: UpdateProfileInput!): Profile!
  }

  input CreateProfileInput {
    userId: ID!
    firstName: String!
    bio: String
    age: Int!
    gender: String!
    lookingFor: String!
    interests: [String!]!
    profession: String
    education: String
    isCertified: Boolean!
    images: [String!]!
  }

  input UpdateProfileInput {
    bio: String
    age: Int
    gender: String
    lookingFor: String
    interests: [String!]
    profession: String
    education: String
    isCertified: Boolean
    images: [String!]
  }
`; 