import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as UserTypeDefs } from './user.schema';
import { typeDefs as PostTypeDefs } from './post.schema';
import { typeDefs as FollowTypeDefs } from './follow.schema';
import { typeDefs as CommentTypeDefs } from './comment.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, UserTypeDefs, PostTypeDefs, FollowTypeDefs, CommentTypeDefs]);
