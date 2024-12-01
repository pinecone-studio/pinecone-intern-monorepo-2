import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as UserTypeDefs } from './user.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, UserTypeDefs]);
