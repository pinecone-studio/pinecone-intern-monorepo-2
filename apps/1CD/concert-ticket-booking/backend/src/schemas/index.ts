import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as authTypeDefs } from './auth.schema';
import { typeDefs as venueTypeDefs } from './venue.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, authTypeDefs, venueTypeDefs]);
