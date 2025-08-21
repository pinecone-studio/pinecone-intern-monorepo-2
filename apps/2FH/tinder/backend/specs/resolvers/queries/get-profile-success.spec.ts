import { Types } from 'mongoose';
import { getProfile } from 'src/resolvers/queries';
import { Profile as ProfileModel, Swipe as SwipeModel } from 'src/models';
import { Gender } from 'src/generated';
import { GraphQLResolveInfo, GraphQLObjectType, GraphQLSchema, OperationDefinitionNode, SelectionSetNode } from 'graphql';

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

describe('getProfile Resolver - Success Cases', () => {
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

  const createMockProfile = (gender: string, dateOfBirth?: Date | string | null) => ({
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    name: 'Test User',
    gender,
    bio: 'Test bio',
    interests: ['coding', 'gaming'],
    profession: 'Developer',
    work: 'Tech Company',
    images: ['image1.jpg'],
    dateOfBirth,
    createdAt: new Date('2025-08-16T16:31:10.275Z'),
    updatedAt: new Date('2025-08-16T16:31:10.275Z'),
  });

  const testProfile = async (gender: string, expectedGender: Gender, dateOfBirth?: Date | string | null, expectedDateOfBirth: string | null = null) => {
    const mockProfile = createMockProfile(gender, dateOfBirth);
    mockFindOne.mockResolvedValue(mockProfile);

    const result = await getProfile!({}, { userId: mockProfile.userId.toHexString() }, mockContext, mockInfo);

    expect(mockFindOne).toHaveBeenCalledWith({ userId: expect.any(Types.ObjectId) });
    expect(result).toEqual({
      id: mockProfile._id.toHexString(),
      userId: mockProfile.userId.toHexString(),
      name: mockProfile.name,
      gender: expectedGender,
      bio: mockProfile.bio,
      interests: mockProfile.interests,
      profession: mockProfile.profession,
      work: mockProfile.work,
      images: mockProfile.images,
      dateOfBirth: expectedDateOfBirth,
      createdAt: mockProfile.createdAt.toISOString(),
      updatedAt: mockProfile.updatedAt.toISOString(),
      likes: [],
      matches: [],
    });
  };

  it('should return profile data for male gender with Date dateOfBirth', async () => {
    await testProfile('male', Gender.Male, new Date('1990-01-01'), '1990-01-01T00:00:00.000Z');
  });

  it('should return profile data for female gender with string dateOfBirth', async () => {
    await testProfile('female', Gender.Female, '1990-01-01', '1990-01-01T00:00:00.000Z');
  });

  it('should return profile data for both gender with null dateOfBirth', async () => {
    await testProfile('both', Gender.Both, null, '');
  });

  it('should return profile data with likes and matches', async () => {
    const mockProfile = createMockProfile('male', new Date('1990-01-01'));
    const likedUserId = new Types.ObjectId();
    const matchedUserId = new Types.ObjectId();
    
    // Add matches to the profile
    (mockProfile as any).matches = [matchedUserId];

    const mockLikes = [{
      targetId: { _id: likedUserId }
    }];

    const mockMatches = [{
      userId: matchedUserId
    }];

    mockFindOne.mockResolvedValue(mockProfile);
    mockSwipeFind.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockLikes)
    } as any);
    mockProfileFind.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockMatches)
    } as any);

    const result = await getProfile!({}, { userId: mockProfile.userId.toHexString() }, mockContext, mockInfo);

    expect(mockFindOne).toHaveBeenCalledWith({ userId: expect.any(Types.ObjectId) });
    expect(result).toEqual({
      id: mockProfile._id.toHexString(),
      userId: mockProfile.userId.toHexString(),
      name: mockProfile.name,
      gender: Gender.Male,
      bio: mockProfile.bio,
      interests: mockProfile.interests,
      profession: mockProfile.profession,
      work: mockProfile.work,
      images: mockProfile.images,
      dateOfBirth: '1990-01-01T00:00:00.000Z',
      createdAt: mockProfile.createdAt.toISOString(),
      updatedAt: mockProfile.updatedAt.toISOString(),
      likes: [likedUserId.toHexString()],
      matches: [matchedUserId.toHexString()],
    });
  });
});
