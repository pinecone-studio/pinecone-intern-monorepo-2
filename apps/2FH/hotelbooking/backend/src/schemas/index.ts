import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { hotelSchemaTypeDefs } from './hotel.schema';
import { userDefs } from './user.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, userDefs, hotelSchemaTypeDefs]);

