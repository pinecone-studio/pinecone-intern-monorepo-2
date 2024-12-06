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
  }

  type Mutation {
    createsRequest(email : String!,requestType: String!, message: String!, supervisorEmail: String!, requestDate: Date!): RequestType
  }
`;
