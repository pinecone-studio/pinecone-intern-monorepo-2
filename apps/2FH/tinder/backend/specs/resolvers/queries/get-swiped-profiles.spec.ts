import { Types } from 'mongoose';
import { getSwipedProfiles } from 'src/resolvers/queries/swipe-queries';
import { Swipe as SwipeModel, Profile as ProfileModel } from 'src/models';
import { GraphQLError, GraphQLResolveInfo, GraphQLObjectType, GraphQLSchema, OperationDefinitionNode, SelectionSetNode } from 'graphql';

// Mock the models
jest.mock('src/models', () => ({
  Swipe: {
    find: jest.fn(),
  },
  Profile: {
    find: jest.fn(),
  },
}));

describe('getSwipedProfiles', () => {
  const mockSwipeModel = SwipeModel as jest.Mocked<typeof SwipeModel>;
  const mockProfileModel = ProfileModel as jest.Mocked<typeof ProfileModel>;
  const mockContext = {};
  const mockInfo: GraphQLResolveInfo = {
    fieldName: 'getSwipedProfiles',
    fieldNodes: [],
    returnType: new GraphQLObjectType({ name: 'Profile', fields: {} }),
    parentType: new GraphQLObjectType({ name: 'Query', fields: {} }),
    path: { key: 'getSwipedProfiles', typename: 'Query', prev: undefined },
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

  it('should return swiped profiles for valid user ID', async () => {
    const mockSwipes = [
      {
        _id: new Types.ObjectId(),
        swiperId: new Types.ObjectId(validUserId),
        targetId: {
          _id: new Types.ObjectId(),
          name: 'John Doe',
          images: ['image1.jpg'],
          profession: 'Developer',
          bio: 'Test bio',
          interests: ['coding']
        },
        action: 'LIKE',
        swipedAt: new Date()
      }
    ];

    const mockProfiles = [
      {
        _id: new Types.ObjectId(),
        userId: mockSwipes[0].targetId._id,
        name: 'John Doe',
        gender: 'male',
        bio: 'Test bio',
        interests: ['coding'],
        profession: 'Developer',
        work: 'Tech Company',
        images: ['image1.jpg'],
        dateOfBirth: '1990-01-01',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mockSwipeModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSwipes)
    } as any);

    mockProfileModel.find.mockResolvedValue(mockProfiles);

    const result = await getSwipedProfiles({}, { userId: validUserId }, mockContext, mockInfo);

    expect(result).toEqual(mockProfiles);
  });

  it('should return empty array when no swipes found', async () => {
    mockSwipeModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([])
    } as any);

    mockProfileModel.find.mockResolvedValue([]);

    const result = await getSwipedProfiles({}, { userId: validUserId }, mockContext, mockInfo);

    expect(result).toEqual([]);
  });

  it('should throw error for invalid user ID format', async () => {
    const invalidUserId = 'invalid-id';

    await expect(getSwipedProfiles({}, { userId: invalidUserId }, mockContext, mockInfo))
      .rejects.toThrow(new GraphQLError('Failed to get swiped profiles: Invalid user ID format'));
  });

  it('should handle database errors gracefully', async () => {
    const errorMessage = 'Database connection failed';
    mockSwipeModel.find.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error(errorMessage))
    } as any);

    await expect(getSwipedProfiles({}, { userId: validUserId }, mockContext, mockInfo))
      .rejects.toThrow(new GraphQLError(`Failed to get swiped profiles: ${errorMessage}`));
  });
}); 