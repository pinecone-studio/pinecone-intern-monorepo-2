import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date
  type RoomServiceType {
    bathroom: [String]
    accessability: [String]
    entertaiment: [String]
    foodDrink: [String]
    bedroom: [String]
    other: [String]
  }
  type Hotel {
    createdAt: Date
    _id: ID!
    hotelName: String
    description: String
    starRating: Int
    userRating: Int
    phoneNumber: Int
  }

  type Room {
    id: ID!
    roomService: RoomServiceType!
    hotelId: Hotel
    roomName: String
    roomType: String
    price: Int
    roomInformation: String
    createdAt: Date
  }

  input RoomServiceInput {
    bathroom: [String]
    accessability: [String]
    entertaiment: [String]
    foodDrink: [String]
    bedroom: [String]
    other: [String]
  }

  type RoomType {
    _id: ID
    hotelId: ID!
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
  input RoomFilterType {
    checkInDate: Date
    checkOutDate: Date
    starRating: Int
  }
  type Query {
    getRooms(input: RoomFilterType!): [Room!]!
    hotelDetail(hotelId: ID!): [RoomType!]!
    hotelService(roomId: ID!): [RoomServiceType!]!
  }
  type Mutation {
    addRoom(input: RoomTypeInput!): RoomType!
    addRoomService(input: RoomServiceInput!, roomId: ID!): Room!
  }
`;
