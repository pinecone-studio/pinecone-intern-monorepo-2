import { Types } from 'mongoose';
import { getNextProfile } from 'src/resolvers/queries/swipe-queries';
import { Swipe as SwipeModel, Profile as ProfileModel } from 'src/models';
import { GraphQLError, GraphQLResolveInfo, GraphQLObjectType, GraphQLSchema, OperationDefinitionNode, SelectionSetNode } from 'graphql';

// Mock the models
jest.mock('src/models', () => ({
  Swipe: {
    find: jest.fn(),
  },
  Profile: {
    findOne: jest.fn(),
  },
}));

describe('getNextProfile', () => {
  const mockSwipeModel = SwipeModel as jest.Mocked<typeof SwipeModel>;
  const mockProfileModel = ProfileModel as jest.Mocked<typeof ProfileModel>;
  const mockContext = {};
  const mockInfo: GraphQLResolveInfo = {
    fieldName: 'getNextProfile',
    fieldNodes: [],
    returnType: new GraphQLObjectType({ name: 'Profile', fields: {} }),
    parentType: new GraphQLObjectType({ name: 'Query', fields: {} }),
    path: { key: 'getNextProfile', typename: 'Query', prev: undefined },
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

  it('should return next profile when available', async () => {
    const mockProfile = {
      _id: new Types.ObjectId(),
      userId: new Types.ObjectId(),
      name: 'Jane Doe',
      gender: 'female',
      bio: 'Test bio',
      interests: ['reading'],
      profession: 'Designer',
      work: 'Design Studio',
      images: ['image2.jpg'],
      dateOfBirth: '1995-01-01',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockSwipeModel.find.mockReturnValue({
      distinct: jest.fn().mockResolvedValue([new Types.ObjectId()])
    } as any);

    mockProfileModel.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockProfile)
    } as any);

    const result = await getNextProfile({}, { userId: validUserId }, mockContext, mockInfo);

    expect(result).toEqual(mockProfile);
  });

  it('should return null when no more profiles available', async () => {
    mockSwipeModel.find.mockReturnValue({
      distinct: jest.fn().mockResolvedValue([new Types.ObjectId()])
    } as any);

    mockProfileModel.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    } as any);

    const result = await getNextProfile({}, { userId: validUserId }, mockContext, mockInfo);

    expect(result).toBeNull();
  });

  it('should throw error for invalid user ID format', async () => {
    const invalidUserId = 'invalid-id';

    await expect(getNextProfile({}, { userId: invalidUserId }, mockContext, mockInfo))
      .rejects.toThrow(new GraphQLError('Failed to get next profile: Invalid user ID format'));
  });

  it('should handle database errors gracefully', async () => {
    const errorMessage = 'Database connection failed';
    
    mockSwipeModel.find.mockReturnValue({
      distinct: jest.fn().mockRejectedValue(new Error(errorMessage))
    } as any);

    await expect(getNextProfile({}, { userId: validUserId }, mockContext, mockInfo))
      .rejects.toThrow(new GraphQLError(`Failed to get next profile: ${errorMessage}`));
  });
}); 