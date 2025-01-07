import gql from 'graphql-tag';

export const typeDefs = gql`
  scalar Date

  # Enum for Request status to restrict the possible values
  enum RequestStatus {
    pending
    done
  }
  type RequestType {
    _id: ID!
    eventId: Event!
    orderId: ID!
    bankAccount: String!
    bankName: String!
    accountOwner: String!
    phoneNumber: String!
    totalPrice: Int!
    status: RequestStatus!
    createdAt: Date!
    updatedAt: Date!
  }
  type Query {
    getRequests: [RequestType!]!
  }
`;
