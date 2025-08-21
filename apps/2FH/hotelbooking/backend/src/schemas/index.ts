import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { userDefs } from './userSchema/user.schema';
import { roomSchemaTypeDefs } from './room.schema';
import { hotelSchemaTypeDefs } from './hotel.schema';
import { emergencyContactSchemaTypeDefs } from './emergency-contact.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, hotelSchemaTypeDefs, roomSchemaTypeDefs, userDefs, emergencyContactSchemaTypeDefs]);
