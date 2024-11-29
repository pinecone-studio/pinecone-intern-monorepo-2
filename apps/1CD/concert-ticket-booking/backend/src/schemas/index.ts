import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as authTypeDefs } from './auth.schema';
import { ticketsTypeDefs } from './tickets.schema';
import { typeDefs as eventTypeDefs } from './event.schema';
import { typeDefs as VenueTypeDefs } from './venue.schema';
import { typeDefs as catTypeDefs } from './category.schema';
import { typeDefs as OrderTypeDefs } from './order.schema';


export const typeDefs = mergeTypeDefs([CommonTypeDefs, authTypeDefs, ticketsTypeDefs, VenueTypeDefs, eventTypeDefs, catTypeDefs, OrderTypeDefs]);
