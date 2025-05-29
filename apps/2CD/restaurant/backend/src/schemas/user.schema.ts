import gql from 'graphql-tag';

const UserTypeDef = gql`
  type User {
    _id: ID!
    userName: String!
    wallet: Float!
    password: String!
    email: String!
  }
  input CreateUserInput {
    userName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
  }
`;
export default UserTypeDef;
