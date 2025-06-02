import gql from 'graphql-tag';

const OrderTypeDef = gql`
  type Order {
    _id: ID!
    orderNumber: Int!
    buyerId: ID!
    orderPrice: Int!
    orderStatus: String!
    orderDate: String!
    tableNumber: Int!
    foodItems: [FoodItem!]!
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
`;
export default OrderTypeDef;
