import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as HotelTypeDefs } from './hotel-schema';
import { typeDefs as RoomTypeDefs } from './room.schema';
import { typeDefs as BookingTypeDefs } from './booking.schema';
import { typeDefs as ReviewTypeDefs } from './review-schema';
import { userTypeDefs } from './user-schema';

export const typeDefs = mergeTypeDefs([
  HotelTypeDefs,
  RoomTypeDefs,
  BookingTypeDefs,
  ReviewTypeDefs,
  userTypeDefs
]);