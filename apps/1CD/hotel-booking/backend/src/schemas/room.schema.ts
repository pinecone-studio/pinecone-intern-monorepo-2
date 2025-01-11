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

  type Room {
    id: ID!
    roomService: RoomServiceType!
    hotelId: Hotel
    roomName: String
    roomType: String
    price: Int
    roomInformation: [String]
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
    roomInformation: [String]
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
    roomInformation: [String]
  }

  input RoomFilterType {
    checkInDate: Date
    checkOutDate: Date
    starRating: Int
    userRating: Int
    hotelAmenities: [String]
    hotelName: String
    price: Int
    roomType: String
  }
  input UpdateRoomInfoInput {
    _id: ID!
    roomName: String!
    roomType: String!
    price: Int!
    roomInformation: [String]!
  }
  input RoomsFilterInput {
    checkInDate: Date
    checkOutDate: Date
    roomType: String
  }
  type Query {
    getFilterByPropertiesHotels(input: RoomFilterType): [Hotel!]!
    hotelDetail(hotelId: ID!, input: RoomsFilterInput!): [RoomType!]!
    hotelService(roomId: ID!): [Room!]!
    getRoom(_id: ID!): Room!
  }
  type Mutation {
    addRoom(input: RoomTypeInput!): RoomType!
    addRoomService(input: RoomServiceInput!, roomId: ID!): Room!
    updateRoomInfo(input: UpdateRoomInfoInput!): Room!
    updateRoomImage(_id: ID!, images: [String!]!): Room!
  }
`;
