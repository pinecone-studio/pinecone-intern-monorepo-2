import { Types } from 'mongoose';
import { MessageOutput } from '../types/get-messages.types';

interface PopulatedMessage {
  _id: Types.ObjectId;
  sender: {
    _id: Types.ObjectId;
    email?: string | null;
    password?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  } | null;
  receiver: {
    _id: Types.ObjectId;
    email?: string | null;
    password?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  } | null;
  content?: string | null;
  createdAt: Date;
}

interface MongooseDocument {
  toObject(): Record<string, unknown>;
}

const formatField = (value: string | null | undefined, defaultValue = '') => {
  return value || defaultValue;
};

const formatDate = (date: Date | null | undefined) => {
  return date?.toISOString() || new Date().toISOString();
};

const formatUser = (
  user: PopulatedMessage['sender'] | PopulatedMessage['receiver'] | null
) => {
  const safeUser = user || {
    _id: new Types.ObjectId(),
    email: '',
    password: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    id: safeUser._id.toString(),
    email: formatField(safeUser.email),
    password: formatField(safeUser.password),
    createdAt: formatDate(safeUser.createdAt),
    updatedAt: formatDate(safeUser.updatedAt),
  };
};

const getPopulatedMessage = (message: PopulatedMessage): PopulatedMessage => {
  if (typeof message === 'object' && message !== null && 'toObject' in message) {
    const obj = (message as MongooseDocument).toObject();
    return {
      _id: obj._id as Types.ObjectId,
      sender: obj.sender as PopulatedMessage['sender'],
      receiver: obj.receiver as PopulatedMessage['receiver'],
      content: obj.content as string | null | undefined,
      createdAt: obj.createdAt as Date,
    };
  }
  return message;
};

export const formatMessage = (message: PopulatedMessage): MessageOutput => {
  const populatedMessage = getPopulatedMessage(message);

  return {
    id: populatedMessage._id.toString(),
    sender: formatUser(populatedMessage.sender),
    receiver: formatUser(populatedMessage.receiver),
    content: populatedMessage.content || '',
    createdAt: populatedMessage.createdAt.toISOString(),
  };
};
