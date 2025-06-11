import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as commonTypeDefs } from './common.schema';
import { typeDefs as userTypeDefs } from './user.schema';
import { typeDefs as likeTypeDefs } from './like.schema';
import { typeDefs as dislikeTypeDefs } from './dislike.schema';
import { typeDefs as matchTypeDefs } from './match.schema';
import { typeDefs as messageTypeDefs } from './message.schema';

export const typeDefs = mergeTypeDefs([
  commonTypeDefs,
  userTypeDefs,
  likeTypeDefs,
  dislikeTypeDefs,
  matchTypeDefs,
  messageTypeDefs,
]);
