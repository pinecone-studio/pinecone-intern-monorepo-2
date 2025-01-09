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

  enum NotificationType {
    FOLLOW
    POSTLIKE
  }

  type Notifications {
    _id: ID!
    otherUserId: User!
    currentUserId: ID!
    notificationType: NotificationType!
    isViewed: Boolean!
    postId: Posts
    createdAt: Date!
  }

  type Query {
    getNotificationsByLoggedUser: [Notifications!]!
  }

  type Mutation {
    viewNotify(_id: ID!): Notifications!
  }
`;
