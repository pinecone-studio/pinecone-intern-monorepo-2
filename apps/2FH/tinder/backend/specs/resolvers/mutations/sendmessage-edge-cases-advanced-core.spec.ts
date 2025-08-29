import { sendMessage } from "../../../src/resolvers/mutations/sendmessage-mutation";
import { User, Message as MessageModel } from "../../../src/models";
import { GraphQLError } from "graphql";

type SendMessageFunction = (_parent: any, _args: any, _context: any) => Promise<any>;
import { Types } from "mongoose";

// Mock sender and receiver IDs
const mockSenderId = new Types.ObjectId().toString();
const mockReceiverId = new Types.ObjectId().toString();

// Mock sender user object
const mockSender = {
    _id: mockSenderId,
    email: 'sender@example.com',
    password: 'hashedPassword123',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
};

// Mock receiver user object
const mockReceiver = {
    _id: mockReceiverId,
    email: 'receiver@example.com',
    password: 'hashedPassword456',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
};

// Mock message object
const mockMessage = {
    _id: new Types.ObjectId(),
    sender: new Types.ObjectId(mockSenderId),
    receiver: new Types.ObjectId(mockReceiverId),
    content: 'Hello, how are you?',
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
};

// Mock context object
const mockContext = {
    user: {
        id: mockSenderId,
        email: 'sender@example.com'
    }
};

// Mock send message input
const createMockSendMessageInput = () => ({
    senderId: mockSenderId,
    receiverId: mockReceiverId,
    content: 'Hello, how are you?',
});

jest.mock("../../../src/models", () => ({
    User: {
        findById: jest.fn(),
    },
    Message: {
        create: jest.fn(),
    },
}));

describe("sendMessage Edge Cases Advanced Core", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks
        (User.findById as jest.Mock)
            .mockResolvedValueOnce(mockSender)
            .mockResolvedValueOnce(mockReceiver);

        (MessageModel.create as jest.Mock).mockResolvedValue(mockMessage);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("Invalid ObjectId validation", () => {
        it("should throw error for invalid senderId", async () => {
            const invalidSenderId = "invalid-id";

            await expect(
                (sendMessage as unknown as SendMessageFunction)(null, {
                    input: {
                        senderId: invalidSenderId,
                        receiverId: mockReceiverId,
                        content: "Hello"
                    }
                }, mockContext)
            ).rejects.toThrow(GraphQLError);
        });

        it("should throw error for invalid receiverId", async () => {
            const invalidReceiverId = "invalid-id";

            await expect(
                (sendMessage as unknown as SendMessageFunction)(null, {
                    input: {
                        senderId: mockSenderId,
                        receiverId: invalidReceiverId,
                        content: "Hello"
                    }
                }, mockContext)
            ).rejects.toThrow(GraphQLError);
        });
    });

    describe("User not found scenarios", () => {
        it("should throw error when sender is not found", async () => {
            // Reset User.findById mock for this specific test
            (User.findById as jest.Mock).mockReset();
            (User.findById as jest.Mock)
                .mockResolvedValueOnce(null) // sender not found
                .mockResolvedValueOnce(mockReceiver);

            await expect(
                (sendMessage as unknown as SendMessageFunction)(null, {
                    input: createMockSendMessageInput()
                }, mockContext)
            ).rejects.toThrow(GraphQLError);
        });

        it("should throw error when receiver is not found", async () => {
            // Reset User.findById mock for this specific test
            (User.findById as jest.Mock).mockReset();
            (User.findById as jest.Mock)
                .mockResolvedValueOnce(mockSender)
                .mockResolvedValueOnce(null); // receiver not found

            await expect(
                (sendMessage as unknown as SendMessageFunction)(null, {
                    input: createMockSendMessageInput()
                }, mockContext)
            ).rejects.toThrow(GraphQLError);
        });
    });
}); 