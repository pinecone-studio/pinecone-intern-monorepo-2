import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { MatchesTypeDefs } from './matches.schema';
import { ProfileTypeDefs } from './profile.schema';
import { SwipeTypeDefs } from './swipe.schema';
import { UserTypeDefs } from './user-schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs,MatchesTypeDefs,ProfileTypeDefs,SwipeTypeDefs,UserTypeDefs]);
