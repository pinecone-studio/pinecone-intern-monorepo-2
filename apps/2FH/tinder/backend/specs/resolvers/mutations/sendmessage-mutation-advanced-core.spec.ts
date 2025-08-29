import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { sendMessage } from '../../../src/resolvers/mutations/sendmessage-mutation';
import { Message, User } from '../../../src/models';

// Mock the models
jest.mock('../../../src/models', () => ({
    Message: {
        create: jest.fn(),
    },
    User: {
        findById: jest.fn(),
    },
}));

// Mock the server module
jest.mock('../../../src/server-core', () => ({
    io: {
        to: jest.fn().mockReturnValue({
            emit: jest.fn(),
        }),
    },
    userSockets: new Map(),
}));

// Import the mocked functions
// io import removed as it's not used in this file

// Mock console methods to avoid noise in tests
const consoleSpy = {
    log: jest.spyOn(console, 'log').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
};

describe('sendMessage mutation Advanced Core', () => {
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

    describe('Advanced validation scenarios', () => {
        it('should handle null input gracefully', async () => {
            await expect(
                (sendMessage as any)(null, { input: null })
            ).rejects.toThrow(GraphQLError);
        });

        it('should handle undefined input gracefully', async () => {
            await expect(
                (sendMessage as any)(null, { input: undefined })
            ).rejects.toThrow(GraphQLError);
        });



        it('should handle empty string fields', async () => {
            const emptyFieldsInput = {
                senderId: '',
                receiverId: '',
                content: '',
            };

            await expect(
                (sendMessage as any)(null, { input: emptyFieldsInput })
            ).rejects.toThrow(GraphQLError);
        });





        it('should handle special characters in content', async () => {
            const specialContent = 'Hello! @#$%^&*()_+-=[]{}|;:,.<>?';
            const specialContentInput = {
                ...validInput,
                content: specialContent,
            };

            (User.findById as jest.Mock)
                .mockResolvedValueOnce(mockSender)
                .mockResolvedValueOnce(mockReceiver);

            (Message.create as jest.Mock).mockResolvedValue(mockCreatedMessage);

            const result = await (sendMessage as any)(null, { input: specialContentInput });

            expect(result).toBeDefined();
            expect(result.content).toBe(specialContent);
        });


    });

    describe('Database interaction scenarios', () => {
        it('should handle database connection timeout', async () => {
            (User.findById as jest.Mock).mockRejectedValue(new Error('Connection timeout'));

            await expect(
                (sendMessage as any)(null, { input: validInput })
            ).rejects.toThrow(GraphQLError);
        });



        it('should handle message creation failure', async () => {
            (User.findById as jest.Mock)
                .mockResolvedValueOnce(mockSender)
                .mockResolvedValueOnce(mockReceiver);

            (Message.create as jest.Mock).mockRejectedValue(new Error('Message creation failed'));

            await expect(
                (sendMessage as any)(null, { input: validInput })
            ).rejects.toThrow(GraphQLError);
        });
    });
}); 