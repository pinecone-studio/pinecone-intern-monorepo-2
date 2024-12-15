import {gql} from '@apollo/client'

export const CREATE_CHAT = gql`

mutation CreateChat($input: TinderChatinput!){
    createChat(input: $input){
        content,
        senderId
    }
}
`

export const GET_CHAT = gql`
query GetChatbyId($input: GetChat!){
    getChat(input: $input){
        _id,
        content,
        senderId,
        createdAt
    }
}
`