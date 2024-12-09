import gql from 'graphql-tag';

export const typeDefs = gql`

type Order {
    _id:ID!
    userId:User!
    eventId: ID!
    ticketId: ID!
    status:String!
    orderNumber:Int!
    ticketType: [TicketType!]!
    createdAt:Date!
    updatedAt:Date!
}
input OrderInput {
    eventId:ID!
    ticketId:ID!
    status:String!
    orderNumber:Int!
    ticketType:[MyTicketTypeInput!]!
}
input MyTicketTypeInput {
    _id:ID!
    zoneName: String!
    soldQuantity: Int!
    totalQuantity:Int!
    unitPrice: Int!
    discount: Int!
    additional: String!
  }

type Query {
    getOrder: [Order]!
}

type Mutation {
    addToCarts(input: OrderInput!): Order!
    deleteOrder(_id: ID!): Order!
}
`;

// import gql from "graphql-tag";

// export const orderTypedefs = gql`
//   type Request {
//     _id: String!
//     eventId: Schema.Types.ObjectId!
//     bankAccount: string!
//     bankName: strin!
//     accountOwner: string!
//     phoneNumber: string!
//     totalPrice: number!
//     status: String!
//     orderId: String!
//   }
//   type Mutation {
//     changeReq(_id:ID!): String!
//   }
// `