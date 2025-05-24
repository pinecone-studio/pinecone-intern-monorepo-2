import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { userDefs } from './user.schema';
import { bookingDef } from './booking.schema';
import { concertDef } from './concert.schema';
import { otpDef } from './otp.schema';
import { requestDef } from './requist.schema';
import { scheduleDef } from './schedule.schema';
import { ticketDef } from './ticket.schema';
import { venueDef } from './venue.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, userDefs, bookingDef, concertDef, otpDef, requestDef, scheduleDef, ticketDef, venueDef]);
