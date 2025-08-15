import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { roomSchemaTypeDefs } from './room.schema';
import { hotelSchemaTypeDefs } from './hotel.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, hotelSchemaTypeDefs, roomSchemaTypeDefs]);