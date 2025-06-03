import gql from 'graphql-tag';
const allNotificationTypeDef = gql`
  type allNotification {
    _id: ID!
    userId: ID!
    orderNumber: String
    message: String!
    status: String
    createdAt: Date!
  }
  type Query {
    allNotificationQuery(userId: String!): [allNotification]!
  }
`;
export default allNotificationTypeDef;
