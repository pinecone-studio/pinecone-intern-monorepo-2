import gql from 'graphql-tag';

export const venueDef = gql`
  type Venue {
    id: ID!
    name: String!
    address: String!
    city: String!
    capacity: String!
    createdAt: Date!
    updatedAt: Date!
  }
`;
