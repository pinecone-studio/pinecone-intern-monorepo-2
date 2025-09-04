import gql from "graphql-tag";

export const MatchesTypeDefs = gql`
    type Match {
        id: ID!
        likeduserId: Profile
        matcheduserId: Profile
        matchedAt: Date!
    }

    type Query {
        matches(userId: ID!): [Match!]!
    }

    input CreateMatchInput {
        likeduserId: ID!
        matcheduserId: ID!
    }
    type Mutation {
        createMatch(input: CreateMatchInput!): Match!
    }
`