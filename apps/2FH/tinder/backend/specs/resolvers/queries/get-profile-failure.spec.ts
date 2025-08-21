import { Types } from 'mongoose';
import { getProfile } from 'src/resolvers/queries';
import { Profile as ProfileModel, Swipe as SwipeModel } from 'src/models';
import { GraphQLError, GraphQLResolveInfo, GraphQLObjectType, GraphQLSchema, OperationDefinitionNode, SelectionSetNode } from 'graphql';

const mockContext = {};
const mockInfo: GraphQLResolveInfo = {
  fieldName: 'getProfile',
  fieldNodes: [],
  returnType: new GraphQLObjectType({ name: 'Profile', fields: {} }),
  parentType: new GraphQLObjectType({ name: 'Query', fields: {} }),
  path: { key: 'getProfile', typename: 'Query', prev: undefined },
  schema: new GraphQLSchema({}),
  fragments: {},
  rootValue: {},
  operation: { kind: 'OperationDefinition', operation: 'query', selectionSet: { kind: 'SelectionSet', selections: [] } as SelectionSetNode } as OperationDefinitionNode,
  variableValues: {},
};

describe('getProfile Resolver - Error Cases', () => {
  const mockFindOne = jest.spyOn(ProfileModel, 'findOne');
  const mockSwipeFind = jest.spyOn(SwipeModel, 'find');
  const mockProfileFind = jest.spyOn(ProfileModel, 'find');

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());
  });

  afterAll(() => {
    jest.spyOn(console, 'error').mockRestore();
    jest.spyOn(console, 'warn').mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    // Mock SwipeModel.find().populate() chain
    mockSwipeFind.mockReturnValue({
      populate: jest.fn().mockResolvedValue([])
    } as any);
    
    // Mock ProfileModel.find().select() chain
    mockProfileFind.mockReturnValue({
      select: jest.fn().mockResolvedValue([])
    } as any);
  });

  const createMockProfile = (gender: string, dateOfBirth?: Date | string | null | object) => ({
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    name: 'Test User',
    gender,
    bio: 'Test bio',
    interests: ['coding'],
    profession: 'Developer',
    work: 'Tech Company',
    images: ['image1.jpg'],
    dateOfBirth,
    createdAt: new Date('2025-08-16T16:31:10.275Z'),
    updatedAt: new Date('2025-08-16T16:31:10.275Z'),
  });

  it('should throw "Profile not found" error when profile does not exist', async () => {
    mockFindOne.mockResolvedValue(null);
    await expect(getProfile!({}, { userId: new Types.ObjectId().toHexString() }, mockContext, mockInfo)).rejects.toThrow(
      new GraphQLError('Profile not found', { extensions: { code: 'NOT_FOUND', http: { status: 404 } } })
    );
    expect(mockFindOne).toHaveBeenCalledWith({ userId: expect.any(Types.ObjectId) });
  });

  it('should throw "Invalid userId format" error for invalid userId', async () => {
    await expect(getProfile!({}, { userId: 'invalid-id' }, mockContext, mockInfo)).rejects.toThrow(
      new GraphQLError('Invalid userId format', { extensions: { code: 'BAD_USER_INPUT' } })
    );
    expect(mockFindOne).not.toHaveBeenCalled();
  });

  it('should throw "Invalid gender value" error for unsupported gender', async () => {
    const mockProfile = createMockProfile('invalid_gender');
    mockFindOne.mockResolvedValue(mockProfile);
    await expect(getProfile!({}, { userId: mockProfile.userId.toHexString() }, mockContext, mockInfo)).rejects.toThrow(
      new GraphQLError('Invalid gender value', { extensions: { code: 'BAD_USER_INPUT' } })
    );
    expect(mockFindOne).toHaveBeenCalledWith({ userId: expect.any(Types.ObjectId) });
  });

  it('should handle unexpected errors and throw INTERNAL_SERVER_ERROR with custom message', async () => {
    const errorMessage = 'Database error';
    mockFindOne.mockRejectedValue(new Error(errorMessage));
    await expect(getProfile!({}, { userId: new Types.ObjectId().toHexString() }, mockContext, mockInfo)).rejects.toThrow(
      new GraphQLError(errorMessage, { extensions: { code: 'INTERNAL_SERVER_ERROR' } })
    );
    expect(mockFindOne).toHaveBeenCalledWith({ userId: expect.any(Types.ObjectId) });
  });

  it('should handle unexpected errors with no message and throw INTERNAL_SERVER_ERROR with fallback message', async () => {
    mockFindOne.mockRejectedValue({});
    await expect(getProfile!({}, { userId: new Types.ObjectId().toHexString() }, mockContext, mockInfo)).rejects.toThrow(
      new GraphQLError('Failed to fetch profile', { extensions: { code: 'INTERNAL_SERVER_ERROR' } })
    );
    expect(mockFindOne).toHaveBeenCalledWith({ userId: expect.any(Types.ObjectId) });
  });

  it('should handle null dateOfBirth and return null', async () => {
    const mockProfile = createMockProfile('male', null);
    mockFindOne.mockResolvedValue(mockProfile);

    const result = await getProfile!({}, { userId: mockProfile.userId.toHexString() }, mockContext, mockInfo);

    expect(result.dateOfBirth).toBe('');
    expect(mockFindOne).toHaveBeenCalledWith({ userId: expect.any(Types.ObjectId) });
  });
});