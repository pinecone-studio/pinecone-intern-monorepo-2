import { GraphQLError } from 'graphql';
import { MutationResolvers, Message, User } from '../../generated';
import { Message as MessageModel, User as UserModel } from '../../models';
// Socket functionality will be handled externally to avoid circular dependencies
import { Types } from 'mongoose';

// Helper function to validate ObjectIds
const validateObjectIds = (senderId: string, receiverId: string): void => {
  if (!Types.ObjectId.isValid(senderId) || !Types.ObjectId.isValid(receiverId)) {
    throw new GraphQLError("Cannot send message: Invalid senderId or receiverId");
  }
};

// Helper function to fetch users
const fetchUsers = async (senderId: string, receiverId: string) => {
  const [sender, receiver] = await Promise.all([
    UserModel.findById(senderId),
    UserModel.findById(receiverId)
  ]);

  if (!sender || !receiver) {
    throw new GraphQLError("Cannot send message: Sender or receiver not found");
  }

  return { sender, receiver };
};

// Helper function to safely convert date to ISO string
const safeDateToISO = (date: Date | null | undefined): string => {
  return date?.toISOString() || new Date().toISOString();
};

// Helper function to create user object for GraphQL
const createUserObject = (user: { _id: Types.ObjectId; email: string; password: string; createdAt: Date; updatedAt: Date }): User => ({
  __typename: 'User' as const,
  id: user._id.toString(),
  email: user.email || '',
  password: user.password || '',
  createdAt: safeDateToISO(user.createdAt),
  updatedAt: safeDateToISO(user.updatedAt),
});

// Socket functionality temporarily disabled to avoid circular dependencies
// TODO: Implement socket functionality through dependency injection or events

// Helper function to create message output
const createMessageOutput = (message: { _id: Types.ObjectId; content: string; createdAt: Date }, sender: { _id: Types.ObjectId; email: string; password: string; createdAt: Date; updatedAt: Date }, receiver: { _id: Types.ObjectId; email: string; password: string; createdAt: Date; updatedAt: Date }): Message => ({
  __typename: 'Message',
  id: message._id.toString(),
  content: message.content || '',
  createdAt: message.createdAt.toISOString(),
  sender: createUserObject(sender),
  receiver: createUserObject(receiver),
});

// Helper function to handle message creation and response
const handleMessageCreation = async (
  senderId: string,
  receiverId: string,
  content: string,
  sender: { _id: Types.ObjectId; email: string; password: string; createdAt: Date; updatedAt: Date },
  receiver: { _id: Types.ObjectId; email: string; password: string; createdAt: Date; updatedAt: Date }
): Promise<Message> => {
  const message = await MessageModel.create({ sender: senderId, receiver: receiverId, content });
  return createMessageOutput(message, sender, receiver);
};

export const sendMessage: MutationResolvers['sendMessage'] = async (_, { input }): Promise<Message> => {
  const { senderId, receiverId, content } = input;

  // Validate ObjectIds
  validateObjectIds(senderId, receiverId);

  // Fetch sender/receiver
  const { sender, receiver } = await fetchUsers(senderId, receiverId);

  // Create message and build response
  const output = await handleMessageCreation(senderId, receiverId, content, sender, receiver);

  // Socket message functionality temporarily disabled
  // TODO: Implement socket functionality through dependency injection or events

  return output;
};
