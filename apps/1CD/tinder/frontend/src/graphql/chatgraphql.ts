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
    }
  }
`;
export const GET_MATCHEDUSERS = gql`
query GetMatchedUsers($input: GetChat!){
    getMatch(input: $input){
        _id
        name
        profession
        photos
        age
    }
}
`;
