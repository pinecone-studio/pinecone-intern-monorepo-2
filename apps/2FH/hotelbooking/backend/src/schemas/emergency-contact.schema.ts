import { gql } from 'graphql-tag';

export const emergencyContactSchemaTypeDefs = gql`
  scalar Date

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

  # Input types for mutations
  input CreateEmergencyContactInput {
    userId: ID!
    name: String!
    phone: String!
    relationship: String!
  }

  input UpdateEmergencyContactInput {
    name: String
    phone: String
    relationship: String
  }

  extend type Query {
    getEmergencyContacts(userId: ID!): EmergencyContactsResponse!
    getEmergencyContact(id: ID!): EmergencyContactResponse!
    getAllEmergencyContacts: EmergencyContactsResponse!
  }

  extend type Mutation {
    createEmergencyContact(input: CreateEmergencyContactInput!): EmergencyContactResponse!
    updateEmergencyContact(id: ID!, input: UpdateEmergencyContactInput!): EmergencyContactResponse!
    deleteEmergencyContact(id: ID!): DeleteResponse!
  }`