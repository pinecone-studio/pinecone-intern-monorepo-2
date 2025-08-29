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

// Mock console methods to avoid noise in tests
const consoleSpy = {
    log: jest.spyOn(console, 'log').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
};

describe('sendMessage mutation Core', () => {
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

    describe('Successful message sending', () => {
        it('should send a message successfully with valid input', async () => {
            // Arrange
            (User.findById as jest.Mock)
                .mockResolvedValueOnce(mockSender)
                .mockResolvedValueOnce(mockReceiver);
            (Message.create as jest.Mock).mockResolvedValue(mockCreatedMessage);

            // Act
            const result = await (sendMessage as any)(null, { input: validInput });

            // Assert
            expect(result).toEqual({
                __typename: 'Message',
                id: mockCreatedMessage._id.toString(),
                content: mockCreatedMessage.content,
                createdAt: mockCreatedMessage.createdAt.toISOString(),
                sender: {
                    id: mockSender._id,
                    email: mockSender.email,
                },
                receiver: {
                    id: mockReceiver._id,
                    email: mockReceiver.email,
                },
            });

            expect(User.findById).toHaveBeenCalledWith(mockSenderId);
            expect(User.findById).toHaveBeenCalledWith(mockReceiverId);
            expect(Message.create).toHaveBeenCalledWith({
                sender: new Types.ObjectId(mockSenderId),
                receiver: new Types.ObjectId(mockReceiverId),
                content: validInput.content,
            });
        });





        it('should handle special characters in content', async () => {
            const specialContent = 'Hello! @#$%^&*()_+-=[]{}|;:,.<>?';
            const inputWithSpecialChars = { ...validInput, content: specialContent };
            (User.findById as jest.Mock).mockResolvedValueOnce(mockSender).mockResolvedValueOnce(mockReceiver);
            (Message.create as jest.Mock).mockResolvedValue(mockCreatedMessage);
            const result = await (sendMessage as any)(null, { input: inputWithSpecialChars });
            expect(result).toBeDefined();
            expect(result.content).toBe(specialContent);
        });
    });

    describe('Error handling', () => {
        it('should throw error when sender is not found', async () => {
            (User.findById as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(mockReceiver);
            await expect((sendMessage as any)(null, { input: validInput })).rejects.toThrow(GraphQLError);
            expect(User.findById).toHaveBeenCalledWith(mockSenderId);
            expect(Message.create).not.toHaveBeenCalled();
        });

        it('should throw error when receiver is not found', async () => {
            (User.findById as jest.Mock).mockResolvedValueOnce(mockSender).mockResolvedValueOnce(null);
            await expect((sendMessage as any)(null, { input: validInput })).rejects.toThrow(GraphQLError);
            expect(User.findById).toHaveBeenCalledWith(mockSenderId);
            expect(User.findById).toHaveBeenCalledWith(mockReceiverId);
            expect(Message.create).not.toHaveBeenCalled();
        });

        it('should throw error when message creation fails', async () => {
            (User.findById as jest.Mock).mockResolvedValueOnce(mockSender).mockResolvedValueOnce(mockReceiver);
            (Message.create as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect((sendMessage as any)(null, { input: validInput })).rejects.toThrow(GraphQLError);
            expect(Message.create).toHaveBeenCalled();
        });

        it('should handle GraphQLError and rethrow it', async () => {
            const graphQLError = new GraphQLError('GraphQL validation error');
            (User.findById as jest.Mock).mockRejectedValue(graphQLError);
            await expect((sendMessage as any)(null, { input: validInput })).rejects.toThrow('GraphQL validation error');
        });
    });
}); 