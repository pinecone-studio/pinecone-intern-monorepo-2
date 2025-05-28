import gql from "graphql-tag";

export const typeDefs = gql`
type Room {
  id:ID!
  roomNumber: Int!
  price: String!
  description: String!
  roomImage: [String!]!
  isAvailable: String!
  bedType: String!
  # hotel:Hotel!
  numberOfBed: Int
  createdAt: String!
  updatedAt: String!
  # roomService: RoomService
}
type Hotel {
  id: ID!
  name: String!
  location: String!
  rating: Float
}
input RoomInput{
  roomNumber: Int!
  price: String!
  description: String!
  roomImage: [String!]!
  isAvailable: String!
  bedType: String!
  numberOfBed: Int!
}
type Mutation{
  createRoom(input:RoomInput!):Room!
}
# type Query{
#   getRoom:Response!
# }

`;