import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../generated';
import { Message, User, UserType } from '../../models';
import { io } from '../../server';
import { Types } from 'mongoose';

const userSockets = new Map<string, string>();

type MessageOutput = {
  id: string;
  sender: {
    id: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  };
  receiver: {
    id: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  };
  content: string;
  createdAt: string;
};

const validateUserIds = (senderId: string, receiverId: string) => {
  if (!Types.ObjectId.isValid(senderId) || !Types.ObjectId.isValid(receiverId)) {
    throw new GraphQLError('Cannot send message: Invalid senderId or receiverId');
  }
};

const fetchAndCheckUsers = async (senderId: string, receiverId: string) => {
  const [sender, receiver] = await Promise.all([User.findById(senderId), User.findById(receiverId)]);
  if (!sender || !receiver) throw new GraphQLError('Cannot send message: Sender or receiver not found');
  return { sender, receiver };
};

const createMessage = async (senderId: string, receiverId: string, content: string) => {
  return await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
  });
};

const buildUserObject = (id: string, email: string, password: string, createdAt: string, updatedAt: string) => {
  return { id, email, password, createdAt, updatedAt };
};

const formatUser = (user: UserType & { _id: Types.ObjectId }) => {
  const formatField = (value: any, defaultValue: string) => value ?? defaultValue;
  const formatDate = (date: any) => date?.toISOString() ?? new Date().toISOString();

  return buildUserObject(user._id.toString(), formatField(user.email, ''), formatField(user.password, ''), formatDate(user.createdAt), formatDate(user.updatedAt));
};

const sendSocketNotification = (receiverId: string, messageOutput: MessageOutput) => {
  const receiverSocketId = userSockets.get(receiverId);
  if (receiverSocketId && io) {
    try {
      io.to(receiverSocketId).emit('newMessage', messageOutput);
    } catch (error) {
      console.error('Error emitting socket notification:', error);
    }
  }
};

const formatAndNotify = (
  message: { _id: Types.ObjectId; content: string; createdAt: Date },
  sender: UserType & { _id: Types.ObjectId },
  receiver: UserType & { _id: Types.ObjectId },
  receiverId: string
): MessageOutput => {
  const messageOutput: MessageOutput = {
    id: message._id.toString(),
    sender: formatUser(sender),
    receiver: formatUser(receiver),
    content: message.content ?? '',
    createdAt: message.createdAt.toISOString(),
  };

  sendSocketNotification(receiverId, messageOutput);
  return messageOutput;
};

export const sendMessage: MutationResolvers['sendMessage'] = async (_, { input }): Promise<MessageOutput> => {
  const { senderId, receiverId, content } = input;
  validateUserIds(senderId, receiverId);
  const { sender, receiver } = await fetchAndCheckUsers(senderId, receiverId);
  const message = await createMessage(senderId, receiverId, content);
  return formatAndNotify(message, sender, receiver, receiverId);
};
