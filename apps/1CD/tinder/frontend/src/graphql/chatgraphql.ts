import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation CreateChat($input: TinderChatinput!) {
    createChat(input: $input) {
      content
      senderId
    }
  }
`;
export const GET_CHAT = gql`
  query GetChatbyId($input: GetChatInput!) {
    getChat(input: $input) {
      _id
      content
      senderId
      createdAt
      chatId
    }
  }
`;
export const GET_MATCHEDUSERS = gql`
query GetMatchedUsers{
    getMatch{
        _id
        name
        profession
        photos
        age
        hasChatted
    }
}
`;

export const GET_ONEUSER = gql`
query GetOneUser($input: GetChat!){
  getOneUser(input: $input){
        _id
        name
        profession
        photos
        age
    }
}
`;

export const UPDATE_MATCH= gql`
mutation UpdateMatch($input: GetChatInput!){
  updateMatch(input: $input){
        matched
    }
}
`;
