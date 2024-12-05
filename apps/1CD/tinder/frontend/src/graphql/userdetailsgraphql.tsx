import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation updateUserMutation(
    $id: ID!, 
    $name: String!, 
    $bio: String!, 
    $profession: String!, 
    $schoolWork: [String!], 
    $interests: [String!]
  ) {
    updateUser(
      _id: $id, 
      name: $name, 
      bio: $bio, 
      profession: $profession, 
      schoolWork: $schoolWork, 
      interests: $interests
    ) {
      _id,
      name,
      bio,
      profession,
      schoolWork,
      interests,
    }
  }
`;
