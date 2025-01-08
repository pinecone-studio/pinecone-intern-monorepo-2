import gql from 'graphql-tag';

export const RequestTypeDefs = gql`
  type RequestType {
    _id: ID!
    email: String!
    requestType: String!
    message: String!
    requestDate: Date!
    startTime: Date
    endTime: Date
    supervisorEmail: String!
    result: String
    comment: String
    optionalFile: String
  }

  type User {
    _id: ID!
    email: String!
    userName: String!
    profile: String!
    role: String!
    position: String!
    supervisor: [ID]!
    hireDate: Date!
    createdAt: Date!
    updatedAt: Date!
  }

  type RequestTypePop {
    _id: ID!
    email: User!
    requestType: String!
    message: String!
    requestDate: Date!
    startTime: Date!
    endTime: Date!
    supervisorEmail: String!
    result: String!
    comment: String!
    optionalFile: String!
  }

  type OpenRequestType {
    _id: ID!
    email: String!
    requestType: String!
    message: String!
    requestDate: Date!
    startTime: Date
    endTime: Date
    supervisorEmail: String!
    result: String
    comment: String
    optionalFile: String
    userName: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type GroupedRequests {
    _id: ID!
    requests: [RequestType]
  }

  type AvailablePaidLeaves {
    thisYear: Int
    nextYear: Int
  }
  type AvailableRemoteLeaves {
    thisMonth: Int
    nextMonth: Int
  }
  type NumberOutput {
    res: Int
  }

  type AllGroupedRequests {
    year: Int!
    month: Int!
    requests: [RequestType]!
  }
  type CalculateFilter {
    email: String!
    startDate: Int!
    endDate: Int!
    status: String!
  }

  type GroupedRequestLength {
    _id: String!
    res: Int
  }


  type Mutation {
    createsRequest(email: String!, requestType: String!, message: String!, supervisorEmail: String!, requestDate: Date!, startTime: String, endTime: String, optionalFile: String): RequestType
    updateRequest(result: String, comment: String, _id: ID): RequestType


  }
  input requestInput {
    supervisorEmail: String!
    startDate: Date
    endDate: Date
    status: [String]

  }
  type Query {
    checkAvailablePaidLeaveInGivenYear(email: String!): AvailablePaidLeaves
    checkAvailavleRemoteLeaveInGivenMonth(email: String!): AvailableRemoteLeaves
    getAllRequestsBySupervisor(supervisorEmail: String!, status: [String], page: Int, startDate: Date, endDate: Date, search: String): [RequestTypePop!]
    getRequestById(_id: ID): RequestType
    getRequests(email: String, startDate: Date, endDate: Date, status: String): [GroupedRequests!]

    getAllRequestLength(supervisorEmail: String, email: String): NumberOutput!
    openRequest(_id: ID): OpenRequestType
    getAllRequests(email: String, startDate: Date, endDate: Date, status: String, _id: ID): [AllGroupedRequests!]
    getCalculateFilter(email: String, startDate: Date, endDate: Date, status: String): [AllGroupedRequests!]
    getAllRequestLength(supervisorEmail: String, status: [String], startDate: Date, endDate: Date, search: String): NumberOutput!
    openRequest(_id: ID): OpenRequestType

    groupedByStatusRequestLength: [GroupedRequestLength!]


    groupedByStatusRequestLength(input: requestInput!): [GroupedRequestLength!]

  }
`;
