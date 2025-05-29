import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import FoodTypeDef from './food.schema';
import UserTypeDef from './user.schema';

export const typeDefs = mergeTypeDefs([FoodTypeDef, CommonTypeDefs, UserTypeDef]);
