import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as authTypeDefs } from './auth.schema';
import { ticketTypeDefs } from './ticket.schema';
import { typeDefs as eventTypeDefs } from './event.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, authTypeDefs, ticketTypeDefs, eventTypeDefs]);
