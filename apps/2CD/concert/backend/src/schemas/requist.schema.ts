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
  type Mutation {
    updateRequest(input: updateReqInput): Request!
  }
`;
