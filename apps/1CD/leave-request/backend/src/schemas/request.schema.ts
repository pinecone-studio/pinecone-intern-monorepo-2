import gql from 'graphql-tag';

export const RequestTypeDefs = gql`
  type RequestType {
    _id: ID!
    email: String
    requestType: String
    message: String
    requestDate: Date
    startTime: Date
    endTime: Date
    supervisorEmail: String
    result: String
    comment: String
    file: String
  }

  type AvailablePaidLeaves {
    thisYear: Int
    nextYear: Int
  }
  type AvailableRemoteLeaves {
    thisMonth: Int
    nextMonth: Int
  }

  type Mutation {
    createsRequest(email: String!, requestType: String!, message: String!, supervisorEmail: String!, requestDate: Date!, startTime:Date, endTime:Date, file: String): RequestType
  }
  type Query {
    checkAvailablePaidLeaveInGivenYear(email: String!): AvailablePaidLeaves
    checkAvailavleRemoteLeaveInGivenMonth(email: String!): AvailableRemoteLeaves
  }
`;
