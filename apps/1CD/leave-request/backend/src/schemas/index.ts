import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { UserTypeDefs } from './user.schema';
import { OTPTypeDefs } from './otp.schema';
import { RequestTypeDefs } from './request.schema';
import {typedef as UtilTypeDefs} from './util.schema'

export const typeDefs = mergeTypeDefs([CommonTypeDefs, UserTypeDefs, OTPTypeDefs, RequestTypeDefs, UtilTypeDefs]);
