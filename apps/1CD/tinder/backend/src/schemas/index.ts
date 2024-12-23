import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as UserTypeDefs } from "./user/user.schema";
import { typeDefs as TinderchatTypeDefs } from "./tinderchat/chat.schema";

export const typeDefs = mergeTypeDefs([CommonTypeDefs,UserTypeDefs,TinderchatTypeDefs]);
