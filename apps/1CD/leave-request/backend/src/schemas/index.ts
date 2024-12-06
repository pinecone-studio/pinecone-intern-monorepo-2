import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { UserTypeDefs } from './user.schema';
import { OTPTypeDefs } from './otp.schema';
import { RequestTypeDefs } from './request.schema';

export const typeDefs = mergeTypeDefs([CommonTypeDefs, UserTypeDefs, OTPTypeDefs, RequestTypeDefs]);
