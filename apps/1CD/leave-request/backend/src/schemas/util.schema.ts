import gql from 'graphql-tag';

export const typedef = gql`
  
  type BoolResult {
    res: Boolean
  }

  type Query {
    checkMe(roles: [String]!): BoolResult
  }
`;
