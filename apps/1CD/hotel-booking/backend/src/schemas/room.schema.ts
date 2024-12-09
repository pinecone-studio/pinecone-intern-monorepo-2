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
    hotelId: ID
    roomName: String
    roomType: String
    price: Int
    roomService: RoomServiceType!
    roomInformation: String
    createdAt: Date
    images: [String]
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
        addRoomService(input: RoomServiceInput!, roomId: ID!): RoomType!
  }

  type Query {
    getRooms(hotelId:ID!):[RoomType!]!
    getRoomServiceData(roomId:ID!): [RoomServiceType!]!
  }
`;
