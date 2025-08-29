import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { ERRORS } from '../types/get-conversations.types';

export const validateUserId = (userId: string): void => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new GraphQLError(ERRORS.INVALID_USER_ID, {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
}; 