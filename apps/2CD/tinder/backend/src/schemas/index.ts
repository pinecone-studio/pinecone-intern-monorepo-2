import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as UserTypeDefs } from './user.schema';
import { typeDefs as MatchTypeDefs } from './match.schema';
import { typeDefs as MessageTypeDefs } from './message.schema';
import { typeDefs as LikeTypeDefs } from './like.schema';
import { typeDefs as ProfileTypeDefs } from './profile.schema';

export const typeDefs = mergeTypeDefs([
  CommonTypeDefs,
  UserTypeDefs,
  MatchTypeDefs,
  MessageTypeDefs,
  LikeTypeDefs,
  ProfileTypeDefs
]);
