import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as authTypeDefs } from './auth.schema';
import { ticketTypeDefs } from './ticket.schema';
import { typeDefs as eventTypeDefs } from './event.schema';
import { typeDefs as VenueTypeDefs } from './venue.schema';
import { typeDefs as catTypeDefs } from './category.schema';
import { typeDefs as OrderTypeDefs } from './order.schema';
import { typeDefs as UnitTicketTypeDefs } from './unit-ticket.schema';
import { typeDefs as RequestTypeDefs } from './request.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, authTypeDefs, catTypeDefs, ticketTypeDefs, VenueTypeDefs, eventTypeDefs, OrderTypeDefs, UnitTicketTypeDefs, RequestTypeDefs]);
