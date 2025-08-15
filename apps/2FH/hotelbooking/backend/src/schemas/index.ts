import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { roomSchemaTypeDefs } from './room.schema';
import { print } from 'graphql';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, roomSchemaTypeDefs]);
console.log(print(typeDefs));
