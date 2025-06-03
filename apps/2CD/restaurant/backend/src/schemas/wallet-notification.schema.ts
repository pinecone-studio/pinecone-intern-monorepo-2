import gql from 'graphql-tag';

const walletHistoryTypeDef = gql`
  type walletHistory {
    _id: ID!
    userId: ID!
    amount: Float!
    createdAt: Date!
  }
  type Query {
    walletHistoryQuery(userId: String!): [walletHistory!]!
  }
`;
export default walletHistoryTypeDef;
