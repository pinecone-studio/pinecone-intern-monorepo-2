import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type User {
    _id: ID!
    name: String
    email: String
    bio: String
    age: Int
    gender: String
    interests: [String]
    uploadedPhotos: [String]
    profession: String
    schoolWork: [String]
    createdAt: Date
    updatedAt: Date
    attraction: String
  }
  type Query{
    getUsers:[User!]
  }
`;
