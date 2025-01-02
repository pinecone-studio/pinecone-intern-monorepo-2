import gql from 'graphql-tag';

export const typeDefs = gql`
  type Posts {
    _id: ID!
    user: User!
    description: String
    images: [String!]!
    lastComments: [String]
    commentCount: Int
    likeCount: Int
    updatedAt: Date
    createdAt: Date
  }

  type Notifications {
    _id: ID!
    otherUserId: ID!
    currentUserId: User!
    notificationType: String!
    postId: Posts
    createdAt: Date!
  }

  type Query {
    getNotificationsByLoggedUser(currentUserId: ID!): [Notifications!]!
  }
`;
