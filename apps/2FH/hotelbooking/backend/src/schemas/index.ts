import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { bookingTypeDefs } from './booking.schema';
export const typeDefs = mergeTypeDefs([CommonTypeDefs,bookingTypeDefs]);
