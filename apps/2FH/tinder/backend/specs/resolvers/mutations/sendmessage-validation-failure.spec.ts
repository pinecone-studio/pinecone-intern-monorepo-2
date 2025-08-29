import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { sendMessage } from '../../../src/resolvers/mutations/sendmessage-mutation';
import { Message, User } from '../../../src/models';
import { Server as SocketIOServer, DefaultEventsMap } from 'socket.io';
import mongoose from 'mongoose';
import { closeServer } from '../../../src/server';

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  connect: jest.fn().mockResolvedValue(undefined),
  connection: {
    close: jest.fn().mockResolvedValue(undefined),
  },
  disconnect: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../../src/models', () => ({
  Message: {
    create: jest.fn(),
  },
  User: {
    findById: jest.fn(),
  },
}));
jest.mock('../../../src/server', () => {
  const mockIo: Partial<SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>> | undefined = {
    to: jest.fn().mockReturnValue({
      emit: jest.fn(),
    }),
  };
  return {
    io: mockIo,
    closeServer: jest.fn().mockResolvedValue(undefined),
  };
});
jest.mock('../../../src/generated', () => ({
  MutationResolvers: {},
}));

describe('sendMessage Mutation - Validation & User Check Failures', () => {
  const mockSender = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
    email: 'sender@example.com',
    password: 'hashedPassword123',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockReceiver = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439013'),
    email: 'receiver@example.com',
    password: 'hashedPassword456',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockInput = {
    senderId: '507f1f77bcf86cd799439012',
    receiverId: '507f1f77bcf86cd799439013',
    content: 'Hello, how are you?',
  };

  const mockContext = {};
  const mockInfo = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(Map.prototype, 'get').mockReturnValue(undefined);
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    (User.findById as jest.Mock).mockReset().mockResolvedValueOnce(mockSender).mockResolvedValueOnce(mockReceiver);
    (Message.create as jest.Mock).mockResolvedValue({
      _id: new Types.ObjectId(),
      sender: new Types.ObjectId(mockInput.senderId),
      receiver: new Types.ObjectId(mockInput.receiverId),
      content: mockInput.content,
      createdAt: new Date(),
    });
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.clearAllTimers();
    jest.spyOn(Map.prototype, 'get').mockRestore();
    jest.spyOn(console, 'log').mockRestore();
    jest.spyOn(console, 'error').mockRestore();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    await closeServer();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('validateUserIds - Failure Scenarios', () => {
    it('should throw error for invalid senderId', async () => {
      const invalidInput = { ...mockInput, senderId: 'invalid-id' };
      await expect(sendMessage!({}, { input: invalidInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('Cannot send message: Invalid senderId or receiverId'));
    });

    it('should throw error for invalid receiverId', async () => {
      const invalidInput = { ...mockInput, receiverId: 'invalid-id' };
      await expect(sendMessage!({}, { input: invalidInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('Cannot send message: Invalid senderId or receiverId'));
    });
  });

  describe('fetchAndCheckUsers - Failure Scenarios', () => {
    it('should throw error if sender is not found', async () => {
      (User.findById as jest.Mock).mockReset().mockResolvedValueOnce(null).mockResolvedValueOnce(mockReceiver);
      await expect(sendMessage!({}, { input: mockInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('Cannot send message: Sender or receiver not found'));
    });

    it('should throw error if receiver is not found', async () => {
      (User.findById as jest.Mock).mockReset().mockResolvedValueOnce(mockSender).mockResolvedValueOnce(null);
      await expect(sendMessage!({}, { input: mockInput }, mockContext as any, mockInfo)).rejects.toThrow(new GraphQLError('Cannot send message: Sender or receiver not found'));
    });
  });

  describe('createMessage - Failure Scenarios', () => {
    it('should throw error if message creation fails', async () => {
      (Message.create as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      await expect(sendMessage!({}, { input: mockInput }, mockContext as any, mockInfo)).rejects.toThrow('Database error');
    });
  });
});
