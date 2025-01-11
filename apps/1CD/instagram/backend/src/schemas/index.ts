import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as UserTypeDefs } from './user.schema';
import { typeDefs as PostTypeDefs } from './post.schema';
import { typeDefs as FollowTypeDefs } from './follow.schema';
import { typeDefs as CommentTypeDefs } from './comment.schema';
import { typeDefs as PostLikeTypeDefs } from './post-like.schema';
import { typeDefs as NotificationsTypeDefs } from './notifications.schema';
import { typeDefs as StoryTypeDefs } from './story.schema';
import { typeDefs as ViewStoryTypeDefs } from './view-story.schema';
import { typeDefs as CommentLikeTypeDefs } from './comment-like.schema';

export const typeDefs = mergeTypeDefs([
  CommonTypeDefs,
  CommentLikeTypeDefs,
  UserTypeDefs,
  PostTypeDefs,
  FollowTypeDefs,
  CommentTypeDefs,
  PostLikeTypeDefs,
  NotificationsTypeDefs,
  StoryTypeDefs,
  ViewStoryTypeDefs,
]);
