import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import FoodTypeDef from './food.schema';
import CategoryTypeDef from './category.schema';

export const typeDefs = mergeTypeDefs([FoodTypeDef, CategoryTypeDef, CommonTypeDefs]);
