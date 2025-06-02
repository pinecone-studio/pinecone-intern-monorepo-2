
import { gql } from '@apollo/client';

export const GET_MY_MATCHES = gql`
  query GetMyMatches {
    getMyMatches {
      _id
      createdAt
      users {
        _id
        name
        avatarUrl
      }
    }
  }
`;
