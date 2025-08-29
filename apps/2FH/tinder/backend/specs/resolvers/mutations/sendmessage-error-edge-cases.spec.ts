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

// Mock console methods to avoid noise in tests
const consoleSpy = {
    log: jest.spyOn(console, 'log').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
};

describe('sendMessage Error Edge Cases', () => {
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

    describe('Error handling edge cases', () => {
        it('should handle circular reference errors', async () => {
            const circularInput = {
                ...validInput,
                content: 'Normal content',
            };

            // Mock User.findById to return an object with circular references
            const circularSender = { ...mockSender };
            (circularSender as any).self = circularSender;

            (User.findById as jest.Mock)
                .mockResolvedValueOnce(circularSender)
                .mockResolvedValueOnce(mockReceiver);

            (Message.create as jest.Mock).mockResolvedValue(mockCreatedMessage);

            const result = await (sendMessage as any)(null, { input: circularInput });

            expect(result).toBeDefined();
        });
    });

    describe('Performance edge cases', () => {
        // Performance tests would be added here
        it('placeholder test', () => {
            expect(true).toBe(true);
        });
    });
}); 