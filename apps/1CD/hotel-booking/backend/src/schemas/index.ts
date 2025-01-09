import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as HotelsTypeDefs } from './hotels.schema';

import { typeDefs as RoomTypeDefs } from './room.schema';
import { typeDefs as UserTypeDefs } from './user.schema';

import { typeDefs as BookingTypeDefs } from './booking.schema';

import { typeDefs as PaymentTypeDefs } from './payment.schema';
import { typeDefs as AmenitiesTypeDefs } from './amenities.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, HotelsTypeDefs, RoomTypeDefs, UserTypeDefs, PaymentTypeDefs, BookingTypeDefs, AmenitiesTypeDefs]);
