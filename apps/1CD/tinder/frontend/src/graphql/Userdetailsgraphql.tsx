import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation updateUserMutation(
    $name: String!, 
    $bio: String!, 
    $profession: String!, 
    $schoolWork: [String!], 
    $interests: [String!]
  ) {
    updateUser(
      name: $name, 
      bio: $bio, 
      profession: $profession, 
      schoolWork: $schoolWork, 
      interests: $interests
    ) {
      email
    }
  }
`;
