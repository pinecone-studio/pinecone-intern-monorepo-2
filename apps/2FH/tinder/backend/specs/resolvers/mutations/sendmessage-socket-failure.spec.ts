import { Types } from 'mongoose';
import { sendMessage } from '../../../src/resolvers/mutations/sendmessage-mutation';
import { Message, User } from '../../../src/models';
import { io, closeServer } from '../../../src/server';
import { Server as SocketIOServer, DefaultEventsMap } from 'socket.io';
import mongoose from 'mongoose';

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

describe('sendMessage Mutation - Socket Notification Failures', () => {
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

  describe('Socket Notification Failures', () => {
    it('should handle socket emit errors gracefully', async () => {
      jest.spyOn(Map.prototype, 'get').mockReturnValueOnce('socket123');
      (io?.to as jest.Mock).mockReturnValueOnce({
        emit: jest.fn().mockImplementation(() => {
          throw new Error('Socket emit failed');
        }),
      });
      const result = await sendMessage!({}, { input: mockInput }, mockContext as any, mockInfo);
      expect(result).toBeDefined();
      expect(result.content).toBe(mockInput.content);
      expect(io?.to).toHaveBeenCalledWith('socket123');
      expect(console.error).toHaveBeenCalledWith('Error emitting socket notification:', expect.any(Error));
    });

    it('should handle socket notification without socket ID', async () => {
      jest.spyOn(Map.prototype, 'get').mockReturnValueOnce(undefined);
      const result = await sendMessage!({}, { input: mockInput }, mockContext as any, mockInfo);
      expect(result).toBeDefined();
    });

    it('should handle io undefined scenario', async () => {
      jest.doMock('../../../src/server', () => ({ io: undefined, closeServer: jest.fn().mockResolvedValue(undefined) }));
      const { sendMessage: sendMessageFn } = await import('../../../src/resolvers/mutations/sendmessage-mutation');
      const result = await sendMessageFn!({}, { input: mockInput }, mockContext as any, mockInfo);
      expect(result).toBeDefined();
      jest.unmock('../../../src/server');
    });

    it('should handle socket emit error in catch block', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(Map.prototype, 'get').mockReturnValueOnce('socket123');
      const mockEmit = jest.fn().mockImplementation(() => {
        throw new Error('Socket emit failed');
      });
      (io?.to as jest.Mock).mockReturnValueOnce({ emit: mockEmit });
      const result = await sendMessage!({}, { input: mockInput }, mockContext as any, mockInfo);
      expect(result).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith('Error emitting socket notification:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
