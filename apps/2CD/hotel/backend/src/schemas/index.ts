import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import {typeDefs as RoomTypeDefs} from './room.schema'
import {typeDefs as RoomServiceTypeDefs} from './room-seervice.schema'

export const typeDefs = mergeTypeDefs([CommonTypeDefs, RoomTypeDefs,RoomServiceTypeDefs]);
