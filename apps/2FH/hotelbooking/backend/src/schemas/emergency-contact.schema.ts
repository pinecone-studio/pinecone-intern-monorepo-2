import { gql } from 'apollo-server-express';

export const emergencyContactSchemaTypeDefs = gql`
type EmergencyContact {
  id: ID!
  userId: ID!
  name: String!
  phone: String!
  relationship: String!
  createdAt: Date!
  updatedAt: Date!
}
type EmergencyContactResponse {
  success: Boolean!
  message: String!
  data: EmergencyContact!
}
type EmergencyContactsResponse {
  success: Boolean!
  message: String!
  data: [EmergencyContact!]!
}
type DeleteResponse {
  success: Boolean!
  message: String!
}
extend type Query {
  getEmergencyContacts(userId: ID!): EmergencyContactsResponse!
  getEmergencyContact(id: ID!): EmergencyContactResponse!
}

extend type Mutation {
  createEmergencyContact(userId: ID!, name: String!, phone: String!, relationship: String!): EmergencyContactResponse!
  updateEmergencyContact(
    id: ID!
    name: String
    phone: String
    relationship: String
  ): EmergencyContactResponse!
  deleteEmergencyContact(id: ID!): DeleteResponse!
}
`