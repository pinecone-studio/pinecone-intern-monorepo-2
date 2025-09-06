import { Types } from 'mongoose';
import { getMessagesBetweenUsers } from 'src/resolvers/queries';
import { Message as MessageModel } from 'src/models';
import { GraphQLResolveInfo, GraphQLObjectType, GraphQLSchema, OperationDefinitionNode, SelectionSetNode } from 'graphql';

const mockContext = {};
const mockInfo: GraphQLResolveInfo = {
    fieldName: 'getMessagesBetweenUsers',
    fieldNodes: [],
    returnType: new GraphQLObjectType({ name: 'Message', fields: {} }),
    parentType: new GraphQLObjectType({ name: 'Query', fields: {} }),
    path: { key: 'getMessagesBetweenUsers', typename: 'Query', prev: undefined },
    schema: new GraphQLSchema({}),
    fragments: {},
    rootValue: {},
    operation: { kind: 'OperationDefinition', operation: 'query', selectionSet: { kind: 'SelectionSet', selections: [] } as SelectionSetNode } as OperationDefinitionNode,
    variableValues: {},
};

describe('getMessagesBetweenUsers Resolver', () => {
    const mockFind = jest.spyOn(MessageModel, 'find');
    const mockExec = jest.fn();

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn());
        jest.spyOn(console, 'warn').mockImplementation(jest.fn());
    });

    afterAll(() => {
        jest.spyOn(console, 'error').mockRestore();
        jest.spyOn(console, 'warn').mockRestore();
    });

    beforeEach(() => {
        jest.clearAllMocks();

        // Create individual mock functions
        const mockPopulate1 = jest.fn();
        const mockPopulate2 = jest.fn();
        const mockSort = jest.fn();

        // Create a mock chain that returns itself for chaining
        const mockChain = {
            populate: mockPopulate1.mockReturnValue({
                populate: mockPopulate2.mockReturnValue({
                    sort: mockSort.mockReturnValue({
                        exec: mockExec
                    })
                })
            })
        };

        mockFind.mockReturnValue(mockChain as any);
    });

    const createMockMessage = (id: string, senderId: string, receiverId: string, content: string) => ({
        _id: new Types.ObjectId(id),
        sender: {
            _id: new Types.ObjectId(senderId),
            email: 'sender@example.com',
            password: 'hashedpassword',
            createdAt: new Date('2025-01-01T00:00:00.000Z'),
            updatedAt: new Date('2025-01-01T00:00:00.000Z'),
        },
        receiver: {
            _id: new Types.ObjectId(receiverId),
            email: 'receiver@example.com',
            password: 'hashedpassword',
            createdAt: new Date('2025-01-01T00:00:00.000Z'),
            updatedAt: new Date('2025-01-01T00:00:00.000Z'),
        },
        content,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    });

    it('should return messages between two users', async () => {
        const userId1 = new Types.ObjectId().toHexString();
        const userId2 = new Types.ObjectId().toHexString();

        const mockMessages = [
            createMockMessage('64d1234567890abcdef12345', userId1, userId2, 'Hello from user1'),
            createMockMessage('64d1234567890abcdef12346', userId2, userId1, 'Hello from user2'),
        ];

        mockExec.mockResolvedValue(mockMessages);

        const result = await getMessagesBetweenUsers!({}, { userId1, userId2 }, mockContext as any, mockInfo);

        expect(mockFind).toHaveBeenCalledWith({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 },
            ],
        });
        // Note: The populate and sort calls are chained, so we can't easily test individual calls
        // The important thing is that the function executes without errors and returns the expected result
        expect(mockExec).toHaveBeenCalled();

        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('id', '64d1234567890abcdef12345');
        expect(result[0]).toHaveProperty('content', 'Hello from user1');
        expect(result[1]).toHaveProperty('id', '64d1234567890abcdef12346');
        expect(result[1]).toHaveProperty('content', 'Hello from user2');
    });

    it('should return empty array when no messages found', async () => {
        const userId1 = new Types.ObjectId().toHexString();
        const userId2 = new Types.ObjectId().toHexString();

        mockExec.mockResolvedValue([]);

        const result = await getMessagesBetweenUsers!({}, { userId1, userId2 }, mockContext as any, mockInfo);

        expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
        const userId1 = new Types.ObjectId().toHexString();
        const userId2 = new Types.ObjectId().toHexString();

        mockExec.mockRejectedValue(new Error('Database connection failed'));

        await expect(
            getMessagesBetweenUsers!({}, { userId1, userId2 }, mockContext as any, mockInfo)
        ).rejects.toThrow('Database connection failed');
    });

    it('should call find with correct query parameters', async () => {
        const userId1 = '64d1234567890abcdef12345';
        const userId2 = '64d1234567890abcdef12346';

        mockExec.mockResolvedValue([]);

        await getMessagesBetweenUsers!({}, { userId1, userId2 }, mockContext as any, mockInfo);

        expect(mockFind).toHaveBeenCalledWith({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 },
            ],
        });
    });
});