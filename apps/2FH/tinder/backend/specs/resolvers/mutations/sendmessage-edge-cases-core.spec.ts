import { sendMessage } from "../../../src/resolvers/mutations/sendmessage-mutation";
import { User, Message as MessageModel } from "../../../src/models";

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

// Mock the socket-related modules
jest.mock("../../../src/server", () => ({
    userSocketMap: new Map(),
    io: {
        to: jest.fn(),
    },
    httpServer: undefined,
    isServerReady: jest.fn(() => true),
    getServerStatus: jest.fn(() => 'ready'),
}));

// Import the mocked functions
import { userSocketMap, io } from '../../../src/server';

jest.mock("mongoose", () => ({
    ...jest.requireActual("mongoose"),
    connect: jest.fn().mockResolvedValue(undefined),
    connection: {
        readyState: 1,
        close: jest.fn().mockResolvedValue(undefined),
    },
    disconnect: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../../src/models", () => ({
    User: {
        findById: jest.fn(),
    },
    Message: {
        create: jest.fn(),
    },
}));

describe("sendMessage Edge Cases Core", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks
        (User.findById as jest.Mock)
            .mockResolvedValueOnce(mockSender)
            .mockResolvedValueOnce(mockReceiver);

        (MessageModel.create as jest.Mock).mockResolvedValue(mockMessage);

        // Mock socket functionality
        (io.to as jest.Mock).mockReturnValue({
            emit: jest.fn(),
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("Content validation edge cases", () => {






        it("should handle special characters in content", async () => {
            const specialContent = "Hello! @#$%^&*()_+-=[]{}|;:,.<>?";
            const inputWithSpecialChars = {
                ...createMockSendMessageInput(),
                content: specialContent,
            };

            const result = await (sendMessage as unknown as SendMessageFunction)(null, {
                input: inputWithSpecialChars
            }, mockContext);

            expect(result).toBeDefined();
            expect(result.content).toBe(specialContent);
        });


    });

    describe("Socket and server edge cases", () => {
        it("should handle socket connection failures gracefully", async () => {
            // Mock userSocketMap to return a socket ID
            (userSocketMap as Map<string, string>).set(mockReceiverId, "socket123");

            // Mock the io object to throw an error during sendSocketMessage
            const mockEmit = jest.fn().mockImplementation(() => {
                throw new Error("Socket message failed");
            });
            (io.to as jest.Mock).mockReturnValue({ emit: mockEmit });

            const result = await (sendMessage as unknown as SendMessageFunction)(null, {
                input: createMockSendMessageInput()
            }, mockContext);

            expect(result).toBeDefined();
            expect(result.content).toBe("Hello, how are you?");

            // Verify the socket error was handled gracefully
            expect(io.to).toHaveBeenCalledWith("socket123");
        });
    });
}); 