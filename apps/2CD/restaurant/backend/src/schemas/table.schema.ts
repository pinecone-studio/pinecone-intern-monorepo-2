import gql from 'graphql-tag';
const tableTypeDef = gql`
  type table {
    _id: ID!
    tableName: String!
    qrCodeUrl: String
  }
  type Query {
    allTableQuery(tableName: String!): [table]!
  }
  type Mutation {
    createTable(tableName: String!, qrCodeUrl: String!): table!
  }
`;
export default tableTypeDef;
