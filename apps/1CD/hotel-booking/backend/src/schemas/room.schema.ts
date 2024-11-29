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
  }
  input RoomServiceInput {
    bathroom: [String]
    accessability: [String]
    entertaiment: [String]
    foodDrink: [String]
    bedroom: [String]
    other: [String]
  }
  type Mutation {
    addRoomService(input: RoomServiceInput!, roomId: ID!): Room!
  }
`;
