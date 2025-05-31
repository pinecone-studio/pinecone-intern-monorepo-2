import gql from 'graphql-tag';

const UserTypeDef = gql`
  type User {
    _id: ID!
    userName: String!
    wallet: Float!
    password: String!
    email: String!
    role: String!
  }

  type LoginResponse {
    token: String!
  }

  input CreateUserInput {
    userName: String!
    email: String!
    password: String!
  }

  input UpdateWalletInput {
    _id: ID!
    price: Int!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }
  type ChangePasswordResponse {
    success: Boolean!
    message: String!
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
    userID: String!
  }

  input ResetPasswordinput {
    email: String!
    newPassword: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateWallet(input: UpdateWalletInput!): User!
    userLogin(input: LoginUserInput!): LoginResponse!
    changePassword(input: ChangePasswordInput!): ChangePasswordResponse!
    resetPassword(input: ResetPasswordinput): ChangePasswordResponse
  }
`;

export default UserTypeDef;
