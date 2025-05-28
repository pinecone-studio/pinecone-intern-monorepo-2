import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import FoodTypeDef from './food.schema';

export const typeDefs = mergeTypeDefs([FoodTypeDef,CommonTypeDefs]);
