import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as HotelTypeDefs } from './hotel-schema';
import {typeDefs as RoomTypeDefs} from './room.schema'
import { typeDefs as BookingTypeDefs } from './booking.schema';

export const typeDefs = mergeTypeDefs([HotelTypeDefs, RoomTypeDefs,BookingTypeDefs]);