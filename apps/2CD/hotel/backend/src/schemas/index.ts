import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import {typeDefs as RoomTypeDefs} from './room.schema'
import { userTypeDefs } from './user-schema';
import { adminTypeDefs } from './update-user-role.'
import {typeDefs as BookingTypeDefs} from './booking.schema'


export const typeDefs = mergeTypeDefs([CommonTypeDefs, RoomTypeDefs,BookingTypeDefs, userTypeDefs, adminTypeDefs]);
