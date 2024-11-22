import gql from 'graphql-tag';

export const typeDefs = gql`
    scalar Date
    type User{
        _id:ID!
        name:String!
        email:String!
        bio:String!
        age:Date!
        gender:String!
        interests:[String!]
        photos:[String!]
        profession:String
        schoolWork:[String!]
        createdAt:Date!
        updatedAt:Date!
    }

    input RegisterInput{
        name:String!
        email:String!
        password:String!
        otp:Int!
    }
    
    type AuthResponse{
        user:String!
        token:String!
    }

    type Mutation {
        register(input:RegisterInput!):AuthResponse!
    }
`;
