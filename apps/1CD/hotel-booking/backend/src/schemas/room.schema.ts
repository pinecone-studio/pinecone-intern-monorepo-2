import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type RoomType {
    _id: ID
    hotelId: ID
    roomName: String
    roomType: String
    price: Int
    roomInformation: String
    createdAt: Date
  }
  input RoomTypeInput {
    hotelId: ID
    roomName: String
    roomType: String
    price: Int
    roomInformation: String
  }
  type Mutation {
    addRoom(input: RoomTypeInput!): RoomType!
  }
`;
