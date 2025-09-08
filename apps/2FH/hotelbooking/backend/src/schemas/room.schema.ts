import { gql } from 'graphql-tag';

export const roomSchemaTypeDefs = gql`
  enum typePerson {
    single
    double
    triple
    quad
    queen
    king
  }

  enum roomInformation {
    private_bathroom
    shared_bathroom
    free_bottle_water
    air_conditioner
    tv
    minibar
    free_wifi
    free_parking
    shower
    bathtub
    hair_dryer
    desk
    elevator
  }

  enum bathroom {
    private
    shared
    bathrobes
    free_toiletries
    hair_dryer
  }

  enum accessibility {
    wheelchair_accessible
    wheelchair_accessible_bathroom
    wheelchair_accessible_shower
    wheelchair_accessible_bathtub
  }

  enum internet {
    free_wifi
    free_wired_internet
  }

  enum foodAndDrink {
    free_breakfast
    free_lunch
    free_dinner
    free_snacks
    free_drinks
  }

  enum bedRoom {
    air_conditioner
    bed_sheets
    pillows
    blankets
  }

  enum other {
    daily_housekeeping
    desk
    laptop_workspace
    laptop_workspace_not_available
  }

  enum entertainment {
    tv
    cable_channels
    dvd_player
    adult_movies
    computer
  }

  enum status {
    Cancelled
    Booked
    Pending
    Completed
    Available
  }

  input RoomInput {
    hotelId: ID!
    name: String!
    pricePerNight: Int!
    imageURL: [String]!
    typePerson: typePerson!
    roomInformation: [roomInformation!]!
    bathroom: [bathroom!]!
    accessibility: [accessibility!]!
    internet: [internet!]!
    foodAndDrink: [foodAndDrink!]!
    bedRoom: [bedRoom!]!
    other: [other!]!
    entertainment: [entertainment!]!
    bedNumber: Int!
    status: status!
  }

  input RoomUpdateInput {
    hotelId: ID
    name: String
    pricePerNight: Int
    imageURL: [String]
    typePerson: typePerson
    roomInformation: [roomInformation!]
    bathroom: [bathroom!]
    accessibility: [accessibility!]
    internet: [internet!]
    foodAndDrink: [foodAndDrink!]
    bedRoom: [bedRoom!]
    other: [other!]
    entertainment: [entertainment!]
    bedNumber: Int
    status: status
  }

  type Room {
    id: ID!
    hotelId: ID!
    name: String!
    pricePerNight: Int!
    imageURL: [String]!
    createdAt: Date!
    updatedAt: Date!
    typePerson: typePerson!
    roomInformation: [roomInformation!]!
    bathroom: [bathroom!]!
    accessibility: [accessibility!]!
    internet: [internet!]!
    foodAndDrink: [foodAndDrink!]!
    bedRoom: [bedRoom!]!
    other: [other!]!
    entertainment: [entertainment!]!
    bedNumber: Int!
    status: status!
  }

  type Mutation {
    createRoom(input: RoomInput!): Response!
    updateRoom(id: ID!, input: RoomUpdateInput!): Response!
    deleteRoom(id: ID!): Response!
  }

  type Query {
    getRoom(id: ID!): Room!
    getRooms(hotelId: ID!): [Room!]!
  }
`;
