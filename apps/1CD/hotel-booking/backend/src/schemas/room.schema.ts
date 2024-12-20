import gql from 'graphql-tag';
import { typeDefs as HotelsTypeDefs } from './hotels.schema';
export const typeDefs = gql`
  scalar Date
  ${HotelsTypeDefs}
  type RoomServiceType {
    bathroom: [String]
    accessability: [String]
    entertaiment: [String]
    foodDrink: [String]
    bedroom: [String]
    other: [String]
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
    amenities: [String]
    images: [String]
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
    images: [String!]!
    roomService: RoomServiceType
    amenities: [String]
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
    userRating: Int
    hotelAmenities: [String]
  }

  type Query {
    getRooms(input: RoomFilterType): [Room!]!
    hotelDetail(hotelId: ID!): [RoomType!]!
    hotelService(roomId: ID!): [Room!]!
  }
  type Mutation {
    addRoom(input: RoomTypeInput!): RoomType!
    addRoomService(input: RoomServiceInput!, roomId: ID!): Room!
  }
`;
