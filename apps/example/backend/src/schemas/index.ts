import { mergeTypeDefs } from "@graphql-tools/merge";
import { typeDefs as CommonTypeDefs } from "./common.schema";
import { typeDefs as OrderTypeDefs } from "./order.schema";
import { typeDefs as ProductTypeDefs } from "./product.schema";
import { typeDefs as UserTypeDefs } from "./user.schema";
import { typeDefs as SaveTypeDefs } from "./save.schema";
import { typeDefs as CategoryTypeDefs } from "./category.schema";

export const typeDefs = mergeTypeDefs([
  CommonTypeDefs,
  OrderTypeDefs,
  ProductTypeDefs,
  UserTypeDefs,
  SaveTypeDefs,
  CategoryTypeDefs,
]);
