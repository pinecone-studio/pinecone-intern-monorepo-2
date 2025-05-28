import gql from "graphql-tag";

export const typeDefs = gql`
type RoomService{
    id:ID!,
    bathroom:[String!]!,
    accesibility:[String!]!,
    entertainment:[String!]!,
    foodAndDrink:[String!]!,
    bedroom:[String!]!,
}
`;