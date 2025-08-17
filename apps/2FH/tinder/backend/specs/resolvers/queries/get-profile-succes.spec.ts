import { Types } from 'mongoose';
import { getProfile } from 'src/resolvers/queries';
import { Profile as ProfileModel } from 'src/models';
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

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  afterAll(() => {
    jest.spyOn(console, 'error').mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockProfile = (gender: string) => ({
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    name: 'Test User',
    gender,
    bio: 'Test bio',
    interests: ['coding', 'gaming'],
    profession: 'Developer',
    work: 'Tech Company',
    images: ['image1.jpg'],
    dateOfBirth: new Date('1990-01-01'),
    createdAt: new Date('2025-08-16T16:31:10.275Z'),
    updatedAt: new Date('2025-08-16T16:31:10.275Z'),
  });

  const testProfile = async (gender: string, expectedGender: Gender) => {
    const mockProfile = createMockProfile(gender);
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
      dateOfBirth: mockProfile.dateOfBirth.toISOString(),
      createdAt: mockProfile.createdAt.toISOString(),
      updatedAt: mockProfile.updatedAt.toISOString(),
      likes: [],
      matches: [],
    });
  };

  it('should return profile data for male gender', async () => {
    await testProfile('male', Gender.Male);
  });

  it('should return profile data for female gender', async () => {
    await testProfile('female', Gender.Female);
  });

  it('should return profile data for both gender', async () => {
    await testProfile('both', Gender.Both);
  });
});
