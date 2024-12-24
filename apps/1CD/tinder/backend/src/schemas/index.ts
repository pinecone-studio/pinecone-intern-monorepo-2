import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { typeDefs as UserTypeDefs } from "./user/user.schema";
import { typeDefs as TinderchatTypeDefs } from "./tinderchat/chat.schema";
import { typeDefs as  SwipeTypeDefs} from "./swipe/swipe.schema";

export const typeDefs = mergeTypeDefs([CommonTypeDefs,UserTypeDefs,TinderchatTypeDefs,SwipeTypeDefs]);
