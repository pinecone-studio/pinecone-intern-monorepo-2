import gql from "graphql-tag";

export const PostTypeDefs = gql`
scalar Date

type Post {
    _id: ID!
    author:ID!
    image: [String!]!
    caption: String
    likes:[ID!]!
    comments:[ID!]!
    createdAt: Date!
    updatedAt: Date!
}

input CreatePostInput {
    image: [String!]!
    caption:String
}

type Query {
}

type Mutation {
    createPost(input: CreatePostInput!):Post!
    deletePost(_id: ID!):  Boolean!
}
`