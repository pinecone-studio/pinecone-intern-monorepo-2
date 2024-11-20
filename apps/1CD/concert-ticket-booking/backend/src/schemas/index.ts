import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs]);
