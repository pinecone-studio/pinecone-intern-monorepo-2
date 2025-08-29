import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { ERRORS } from '../types/get-messages.types';

export const validateObjectId = (id: string): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new GraphQLError(ERRORS.INVALID_USER_ID, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
};

const validateSingleUserId = (userId: string, _fieldName: string): void => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new GraphQLError(ERRORS.INVALID_USER_ID, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
};

export const validateUserIds = (senderId?: string, receiverId?: string): void => {
  if (senderId) {
    validateSingleUserId(senderId, 'senderId');
  }
  if (receiverId) {
    validateSingleUserId(receiverId, 'receiverId');
  }
}; 