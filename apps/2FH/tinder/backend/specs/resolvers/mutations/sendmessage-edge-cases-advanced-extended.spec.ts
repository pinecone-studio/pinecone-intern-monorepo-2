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

describe("sendMessage Edge Cases Advanced Extended", () => {
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

    describe("Content validation edge cases", () => {
        it("should handle content with only numbers", async () => {
            const numericContent = "1234567890";
            const inputWithNumericContent = {
                ...createMockSendMessageInput(),
                content: numericContent,
            };

            const result = await (sendMessage as unknown as SendMessageFunction)(null, {
                input: inputWithNumericContent
            }, mockContext);

            expect(result).toBeDefined();
            expect(result.content).toBe(numericContent);
        });

        it("should handle content with only symbols", async () => {
            const symbolContent = "!@#$%^&*()_+-=[]{}|;:,.<>?";
            const inputWithSymbolContent = {
                ...createMockSendMessageInput(),
                content: symbolContent,
            };

            const result = await (sendMessage as unknown as SendMessageFunction)(null, {
                input: inputWithSymbolContent
            }, mockContext);

            expect(result).toBeDefined();
            expect(result.content).toBe(symbolContent);
        });

        it("should handle content with mixed types", async () => {
            const mixedContent = "Hello123!@#World456$%^";
            const inputWithMixedContent = {
                ...createMockSendMessageInput(),
                content: mixedContent,
            };

            const result = await (sendMessage as unknown as SendMessageFunction)(null, {
                input: inputWithMixedContent
            }, mockContext);

            expect(result).toBeDefined();
            expect(result.content).toBe(mixedContent);
        });
    });

    describe("Database error handling", () => {
        it("should handle message creation failures", async () => {
            (MessageModel.create as jest.Mock).mockRejectedValue(new Error("Database error"));

            await expect(
                (sendMessage as unknown as SendMessageFunction)(null, {
                    input: createMockSendMessageInput()
                }, mockContext)
            ).rejects.toThrow(GraphQLError);
        });

        it("should handle database connection timeout", async () => {
            (MessageModel.create as jest.Mock).mockRejectedValue(new Error("Connection timeout"));

            await expect(
                (sendMessage as unknown as SendMessageFunction)(null, {
                    input: createMockSendMessageInput()
                }, mockContext)
            ).rejects.toThrow(GraphQLError);
        });
    });
}); 