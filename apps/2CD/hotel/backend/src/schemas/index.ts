import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import {typeDefs as Room} from './room.schema'
import {typeDefs as RoomService} from './room-service.schema'

export const typeDefs = mergeTypeDefs([CommonTypeDefs, Room, RoomService]);
