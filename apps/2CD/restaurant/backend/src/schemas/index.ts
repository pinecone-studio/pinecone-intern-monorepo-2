import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import FoodTypeDef from './food.schema';
import CategoryTypeDef from './category.schema';
import UserTypeDef from './user.schema';
import OrderTypeDef from './order.schema';

export const typeDefs = mergeTypeDefs([FoodTypeDef, CommonTypeDefs, UserTypeDef, CategoryTypeDef, OrderTypeDef ]);

