import { Types } from 'mongoose';
import { getSwipeHistory } from 'src/resolvers/queries/swipe-queries';
import { Swipe as SwipeModel } from 'src/models';
import { GraphQLError, GraphQLResolveInfo, GraphQLObjectType, GraphQLSchema, OperationDefinitionNode, SelectionSetNode } from 'graphql';

// Mock the models
jest.mock('src/models', () => ({
  Swipe: {
    find: jest.fn(),
  },
}));

describe('getSwipeHistory', () => {
  const mockSwipeModel = SwipeModel as jest.Mocked<typeof SwipeModel>;
  const mockContext = {};
  const mockInfo: GraphQLResolveInfo = {
    fieldName: 'getSwipeHistory',
    fieldNodes: [],
    returnType: new GraphQLObjectType({ name: 'Swipe', fields: {} }),
    parentType: new GraphQLObjectType({ name: 'Query', fields: {} }),
    path: { key: 'getSwipeHistory', typename: 'Query', prev: undefined },
    schema: new GraphQLSchema({}),
    fragments: {},
    rootValue: {},
    operation: { kind: 'OperationDefinition', operation: 'query', selectionSet: { kind: 'SelectionSet', selections: [] } as SelectionSetNode } as OperationDefinitionNode,
    variableValues: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validUserId = new Types.ObjectId().toHexString();

  it('should return swipe history for valid user ID', async () => {
    const mockSwipes = [
      {
        _id: new Types.ObjectId(),
        swiperId: new Types.ObjectId(validUserId),
        targetId: {
          _id: new Types.ObjectId(),
          name: 'John Doe',
          images: ['image1.jpg'],
          profession: 'Developer'
        },
        action: 'LIKE',
        swipedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const mockSort = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSwipes)
    });
    mockSwipeModel.find.mockReturnValue({
      sort: mockSort
    } as any);

    const result = await getSwipeHistory({}, { userId: validUserId }, mockContext, mockInfo);

    expect(result).toEqual([
      {
        id: mockSwipes[0]._id.toString(),
        swiperId: mockSwipes[0].swiperId.toString(),
        targetId: mockSwipes[0].targetId._id.toString(),
        action: mockSwipes[0].action,
        swipedAt: mockSwipes[0].swipedAt
      }
    ]);
  });

  it('should throw error for invalid user ID format', async () => {
    const invalidUserId = 'invalid-id';

    await expect(getSwipeHistory({}, { userId: invalidUserId }, mockContext, mockInfo))
      .rejects.toThrow(new GraphQLError('Failed to get swipe history: Invalid user ID format'));
  });

  it('should handle database errors gracefully', async () => {
    const errorMessage = 'Database connection failed';
    
    const mockSort = jest.fn().mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error(errorMessage))
    });
    mockSwipeModel.find.mockReturnValue({
      sort: mockSort
    } as any);

    await expect(getSwipeHistory({}, { userId: validUserId }, mockContext, mockInfo))
      .rejects.toThrow(new GraphQLError(`Failed to get swipe history: ${errorMessage}`));
  });

  it('should return empty array when no swipes found', async () => {
    const mockSort = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([])
    });
    mockSwipeModel.find.mockReturnValue({
      sort: mockSort
    } as any);

    const result = await getSwipeHistory({}, { userId: validUserId }, mockContext, mockInfo);

    expect(result).toEqual([]);
  });
}); 