import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { userDefs } from './userSchema/user.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, userDefs]);
