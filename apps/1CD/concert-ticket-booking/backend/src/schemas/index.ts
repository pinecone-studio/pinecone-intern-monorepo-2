import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as authTypeDefs } from './auth.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, authTypeDefs]);
