import gql from 'graphql-tag';

const orderNotificationTypeDef = gql`
  scalar Date

  type OrderNotification {
    _id: ID!
    orderId: ID!
    userId: ID!
    message: String!
    seen: Boolean!
    createdAt: Date!
  }

  type Query {
    getOrderNotifications(userId: String!): [OrderNotification!]!
  }

  type Mutation {
    createOrderNotification(orderId: ID!, userId: ID!, orderNumber: Int!, status: String!): OrderNotification!
  }
`;

export default orderNotificationTypeDef;
