import gql from 'graphql-tag';

const OrderTypeDef = gql`
  type Order {
    _id: ID!
    orderNumber: Int!
    buyerId: ID!
    orderPrice: Int!
    orderStatus: String!
    orderDate: String!
    tableNumber: String!
    foodItems: [FoodItem!]!
  }
  type Food {
    _id: ID!
    name: String!
    price: Float!
    image: String
  }
  type FoodItem {
    foodId: ID!
    quantity: Int!
  }

  input CreateOrderInput {
    buyerId: ID!
    orderPrice: Int!
    tableNumber: Int!
    foodItems: [FoodItemInput!]!
  }
  input FoodItemInput {
    foodId: ID!
    quantity: Int!
  }
  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
  }
  type Query {
    getOrder(orderId: ID!): Order!
    getAllOrder: [Order!]!
    getUserOrder(userId: ID!): [Order!]!
  }
`;
export default OrderTypeDef;
