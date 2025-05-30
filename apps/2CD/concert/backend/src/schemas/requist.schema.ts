import gql from 'graphql-tag';

export const requestDef = gql`
  enum requestStatus {
    PENDING
    DONE
  }

  type Request {
    id: ID!
    booking: Booking!
    user: User!
    status: requestStatus!
    bank: String!
    bankAccount: String!
    name: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type Query {
    getPendingRequests: [Request!]!
    getAllRequists: [Request!]!
  }
  input updateReqInput {
    id: ID!
  }
  input createRequestInput {
    Booking: ID!
    user: ID!
    bank: String!
    bankAccount: String!
    name: String!
  }
  type Mutation {
    updateRequest(input: updateReqInput): Response!
    createRequest(input: createRequestInput!): Response!
  }
`;
