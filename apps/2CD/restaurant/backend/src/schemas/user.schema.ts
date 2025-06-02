import gql from 'graphql-tag';

const UserTypeDef = gql`
  type User {
    _id: ID!
    userName: String!
    wallet: Float!
    password: String!
    email: String!
    role: String!
    phoneNumber: String!
  }

  type LoginResponse {
    token: String!
  }

  input CreateUserInput {
    userName: String!
    email: String!
    password: String!
    phoneNumber: String!
  }

  input UpdateWalletInput {
    _id: ID!
    price: Int!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }
  type ChangeResponse {
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

  input changePhoneNumberInput {
    email: String!
    newPhoneNumber: String!
  }

  input changeEmailInput {
    _id: String!
    newEmail: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateWallet(input: UpdateWalletInput!): User!
    userLogin(input: LoginUserInput!): LoginResponse!
    changePassword(input: ChangePasswordInput!): ChangeResponse!
    resetPassword(input: ResetPasswordinput): ChangeResponse
    changePhoneNumber(input: changePhoneNumberInput): ChangeResponse
    changeEmail(input: changeEmailInput): ChangeResponse
  }
  type Query {
    getAllUser: [User!]!
  }
`;

export default UserTypeDef;
