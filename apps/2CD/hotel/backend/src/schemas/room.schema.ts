import gql from "graphql-tag";

export const typeDefs = gql`

type RoomService {
  bathroom: [String!]!
  accesibility: [String!]!
  entertainment: [String!]!
  foodAndDrink: [String!]!
  bedroom: [String!]!
}

input RoomServiceInput {
  bathroom: [String!]!
  accesibility: [String!]!
  entertainment: [String!]!
  foodAndDrink: [String!]!
  bedroom: [String!]!
}
type Room {
  id:ID!
  roomNumber: Int!
  price: String!
  description: String!
  roomImage: [String!]!
  isAvailable: String!
  bedType: String!
  hotel:Hotel!
  numberOfBed: Int
  createdAt: String!
  updatedAt: String!
  roomService: RoomService!
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
  hotel:ID!
  roomService:RoomServiceInput
}
type Mutation{
  createRoom(input:RoomInput!):Room!
  updateRoom(id:ID! input:RoomInput!):Room!
  deleteRoom(id:ID!):Room!
}
 type Query{
   getAllRooms:[Room!]!
   getRoomForId(id:ID!):Room!
 }

`;