import gql from 'graphql-tag';

export const artistDef = gql`
  type Artist {
    id: ID!
    name: String!
    avatarImage: String!
  }
  input CreateArtistInput {
    name: String!
    avatarImage: String!
  }
  type Query {
    getArtists(name:String):[Artist!]!
  }
  type Mutation {
    createArtist(input:CreateArtistInput!):Response!
  }
`;
