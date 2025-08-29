import { Types } from 'mongoose';
import { sendMessage } from '../../../src/resolvers/mutations/sendmessage-mutation';
import { Message, User } from '../../../src/models';

jest.mock('../../../src/models', () => ({
    Message: {
        create: jest.fn(),
    },
    User: {
        findById: jest.fn(),
    },
}));

jest.mock('../../../src/server-core', () => ({
    io: {
        to: jest.fn().mockReturnValue({
            emit: jest.fn(),
        }),
    },
    userSockets: new Map(),
}));

// Import the mocked functions
import { userSockets, io } from '../../../src/server-core';

// Mock console methods to avoid noise in tests
const consoleSpy = {
    log: jest.spyOn(console, 'log').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
};

describe('sendMessage Socket Communication Tests', () => {
    const mockSenderId = new Types.ObjectId().toString();
    const mockReceiverId = new Types.ObjectId().toString();

    const validInput = {
        senderId: mockSenderId,
        receiverId: mockReceiverId,
        content: 'Hello, how are you?',
    };

    const mockSender = {
        _id: mockSenderId,
        email: 'sender@example.com',
        password: 'hashedPassword123',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
    };

    const mockReceiver = {
        _id: mockReceiverId,
        email: 'receiver@example.com',
        password: 'hashedPassword456',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
    };

    const mockCreatedMessage = {
        _id: new Types.ObjectId(),
        sender: new Types.ObjectId(mockSenderId),
        receiver: new Types.ObjectId(mockReceiverId),
        content: validInput.content,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy.log.mockClear();
        consoleSpy.error.mockClear();
    });

    afterAll(() => {
        consoleSpy.log.mockRestore();
        consoleSpy.error.mockRestore();
    });

    describe('Socket communication scenarios', () => {
        it('should handle socket emission failures gracefully', async () => {
            (User.findById as jest.Mock)
                .mockResolvedValueOnce(mockSender)
                .mockResolvedValueOnce(mockReceiver);

            (Message.create as jest.Mock).mockResolvedValue(mockCreatedMessage);

            // Mock socket emission to fail
            const mockEmit = jest.fn().mockImplementation(() => {
                throw new Error('Socket emission failed');
            });
            (io.to as jest.Mock).mockReturnValue({ emit: mockEmit });

            const result = await (sendMessage as any)(null, { input: validInput });

            expect(result).toBeDefined();
            expect(result.content).toBe(validInput.content);
        });

        it('should handle userSockets map manipulation', async () => {
            (User.findById as jest.Mock)
                .mockResolvedValueOnce(mockSender)
                .mockResolvedValueOnce(mockReceiver);

            (Message.create as jest.Mock).mockResolvedValue(mockCreatedMessage);

            // Test with userSockets having the receiver
            (userSockets as Map<string, string>).set(mockReceiverId, 'socket123');

            const result = await (sendMessage as any)(null, { input: validInput });

            expect(result).toBeDefined();
            expect(io.to).toHaveBeenCalledWith('socket123');
        });

        it('should handle multiple socket connections for same user', async () => {
            (User.findById as jest.Mock)
                .mockResolvedValueOnce(mockSender)
                .mockResolvedValueOnce(mockReceiver);

            (Message.create as jest.Mock).mockResolvedValue(mockCreatedMessage);

            // Test with multiple socket IDs for the same user
            (userSockets as Map<string, string>).set(mockReceiverId, 'socket123');
            (userSockets as Map<string, string>).set(mockReceiverId, 'socket456');

            const result = await (sendMessage as any)(null, { input: validInput });

            expect(result).toBeDefined();
        });
    });
}); 