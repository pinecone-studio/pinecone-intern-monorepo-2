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
    optionalFile: String
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
    createsRequest(email: String!, requestType: String!, message: String!, supervisorEmail: String!, requestDate: Date!, startTime:String, endTime:String, optionalFile: String): RequestType
    updateRequest(result: String, comment: String _id: ID): RequestType
  }
  type Query {
    checkAvailablePaidLeaveInGivenYear(email: String!): AvailablePaidLeaves
    checkAvailavleRemoteLeaveInGivenMonth(email: String!): AvailableRemoteLeaves
    getAllRequestsBySupervisor(supervisorEmail: String!): [RequestType]
    getRequestById(_id: ID): RequestType
    getRequests(email: String, startDate: Date, endDate: Date, status: String): [RequestType]
  }
`;
