import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { hotelSchemaTypeDefs } from './hotel.schema';
import { emergencyContactSchemaTypeDefs } from './emergency-contact.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, hotelSchemaTypeDefs, emergencyContactSchemaTypeDefs]);
