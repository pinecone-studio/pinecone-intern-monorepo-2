import { Types } from 'mongoose';
import { Profile } from '../../../src/models/profile-model';
import { getAllProfiles } from '../../../src/resolvers/queries/get-all-profiles';
import { Context } from '../../../src/types';
import { Gender } from '../../../src/generated';
jest.mock('../../../src/models/profile-model', () => ({
  Profile: {
    findOne: jest.fn(),
    find: jest.fn(),}}));
describe('getAllProfiles', () => {
  const mockProfile = Profile as jest.Mocked<typeof Profile>;
  const getAllProfilesResolver = getAllProfiles as (
    _parent: unknown, _args: unknown, _context: Context, _info: unknown
  ) => Promise<any[]>;
  const createMockContext = (currentUser?: { userId: string } | null): Context => ({
    req: {} as never,
    currentUser: currentUser || undefined});
  const createMockInfo = () => ({
    fieldName: 'getAllProfiles', fieldNodes: [], returnType: {} as never, parentType: {} as never, path: { prev: undefined, key: 'getAllProfiles', typename: 'Query' }, schema: {} as never, fragments: {},
    rootValue: {},
    operation: {} as never,
    variableValues: {},
    cacheControl: {} as never});
  const createMockProfileData = (overrides = {}) => ({
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    name: 'Test User',
    gender: 'female',
    bio: 'Test bio',
    interests: ['coding'],
    profession: 'Developer',
    work: 'Tech Company',
    images: ['image1.jpg'],
    likes: [new Types.ObjectId()],
    matches: [new Types.ObjectId()],
    dateOfBirth: new Date('1990-01-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides});
  const createMockDoc = (data: any) => ({
    ...data,
    toObject: jest.fn().mockReturnValue(data)});
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);});
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should throw error when user is not authenticated (undefined)', async () => {
    await expect(getAllProfilesResolver({}, {}, createMockContext(undefined), createMockInfo()))
      .rejects.toThrow('User not authenticated');
  });
  it('should throw error when user is not authenticated (null)', async () => {
    await expect(getAllProfilesResolver({}, {}, createMockContext(null), createMockInfo()))
      .rejects.toThrow('User not authenticated');
  });
  it('should throw error when user profile not found', async () => {
    mockProfile.findOne.mockResolvedValue(null);
    await expect(getAllProfilesResolver({}, {}, createMockContext({ userId: 'user123' }), createMockInfo()))
      .rejects.toThrow('User profile not found');
  });

  it('should return female profiles for male users', async () => {
    const mockUserProfile = { userId: 'user123', gender: 'male' } as any;
    const mockProfileData = createMockProfileData({ gender: 'female' });
    const mockDoc = createMockDoc(mockProfileData);
    mockProfile.findOne.mockResolvedValue(mockUserProfile);
    mockProfile.find.mockResolvedValue([mockDoc]);
    const result = await getAllProfilesResolver({}, {}, createMockContext({ userId: 'user123' }), createMockInfo());
    expect(mockProfile.find).toHaveBeenCalledWith({
      gender: 'female',
      userId: { $ne: 'user123' }
    });
    expect(result).toHaveLength(1);
    expect(result[0].gender).toBe(Gender.Female);
    expect(result[0].likes).toEqual([mockProfileData.likes[0].toString()]);
    expect(result[0].matches).toEqual([mockProfileData.matches[0].toString()]);
  });
  it('should return male profiles for female users', async () => {
    const mockUserProfile = { userId: 'user123', gender: 'female' } as any;
    const mockProfileData = createMockProfileData({ gender: 'male' });
    const mockDoc = createMockDoc(mockProfileData);
    mockProfile.findOne.mockResolvedValue(mockUserProfile);
    mockProfile.find.mockResolvedValue([mockDoc]);
    await getAllProfilesResolver({}, {}, createMockContext({ userId: 'user123' }), createMockInfo());
    expect(mockProfile.find).toHaveBeenCalledWith({
      gender: 'male',
      userId: { $ne: 'user123' }
    });
  });
  it('should return both gender profiles for users preferring both', async () => {
    const mockUserProfile = { userId: 'user123', gender: 'both' } as any;
    mockProfile.findOne.mockResolvedValue(mockUserProfile);
    mockProfile.find.mockResolvedValue([]);
    await getAllProfilesResolver({}, {}, createMockContext({ userId: 'user123' }), createMockInfo());
    expect(mockProfile.find).toHaveBeenCalledWith({
      gender: { $in: ['male', 'female'] },
      userId: { $ne: 'user123' }
    });
  });
  it('should handle unknown gender by not querying profiles', async () => {
    const mockUserProfile = { userId: 'user123', gender: 'unknown' } as any;
    mockProfile.findOne.mockResolvedValue(mockUserProfile);
    const result = await getAllProfilesResolver({}, {}, createMockContext({ userId: 'user123' }), createMockInfo());
    expect(mockProfile.find).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
  it('should map gender types correctly in profile data', async () => {
    const genderMappings = [
      { input: 'male', expected: Gender.Male },
      { input: 'MALE', expected: Gender.Male },
      { input: 'female', expected: Gender.Female },
      { input: 'FEMALE', expected: Gender.Female },
      { input: 'both', expected: Gender.Both },
      { input: 'BOTH', expected: Gender.Both },
      { input: 'unknown', expected: Gender.Male }
    ];
    for (const mapping of genderMappings) {
      jest.clearAllMocks();
      const mockUserProfile = { userId: 'user123', gender: 'male' } as any;
      const mockProfileData = createMockProfileData({ gender: mapping.input });
      const mockDoc = createMockDoc(mockProfileData);
      mockProfile.findOne.mockResolvedValue(mockUserProfile);
      mockProfile.find.mockResolvedValue([mockDoc]);
      const result = await getAllProfilesResolver({}, {}, createMockContext({ userId: 'user123' }), createMockInfo());
      expect(result[0].gender).toBe(mapping.expected);
    }
  });
  it('should handle null likes and matches arrays', async () => {
    const mockUserProfile = { userId: 'user123', gender: 'male' } as any;
    const mockProfileData = createMockProfileData({ likes: null, matches: null });
    const mockDoc = createMockDoc(mockProfileData);
    mockProfile.findOne.mockResolvedValue(mockUserProfile);
    mockProfile.find.mockResolvedValue([mockDoc]);
    const result = await getAllProfilesResolver({}, {}, createMockContext({ userId: 'user123' }), createMockInfo());
    expect(result[0].likes).toEqual([]);
    expect(result[0].matches).toEqual([]);});
  it('should handle database errors and re-throw Error instances', async () => {
    mockProfile.findOne.mockResolvedValue({ userId: 'user123', gender: 'male' } as any);
    const dbError = new Error('Database connection failed');
    mockProfile.find.mockRejectedValue(dbError);

    await expect(getAllProfilesResolver({}, {}, createMockContext({ userId: 'user123' }), createMockInfo()))
      .rejects.toThrow('Database connection failed');});
  it('should handle non-Error exceptions and throw generic error', async () => {
    mockProfile.findOne.mockResolvedValue({ userId: 'user123', gender: 'male' } as any);
    mockProfile.find.mockRejectedValue('String error');
    await expect(getAllProfilesResolver({}, {}, createMockContext({ userId: 'user123' }), createMockInfo()))
      .rejects.toThrow('Failed to fetch profiles');});
  it('should map all profile fields correctly', async () => {
    const mockUserProfile = { userId: 'user123', gender: 'male' } as any;
    const mockProfileData = createMockProfileData();
    const mockDoc = createMockDoc(mockProfileData);
    mockProfile.findOne.mockResolvedValue(mockUserProfile);
    mockProfile.find.mockResolvedValue([mockDoc]);
    const result = await getAllProfilesResolver({}, {}, createMockContext({ userId: 'user123' }), createMockInfo());
    expect(result[0]).toMatchObject({
      id: mockProfileData._id.toString(), userId: mockProfileData.userId.toString(), name: mockProfileData.name, bio: mockProfileData.bio, interests: mockProfileData.interests, profession: mockProfileData.profession, work: mockProfileData.work, images: mockProfileData.images, dateOfBirth: mockProfileData.dateOfBirth, createdAt: mockProfileData.createdAt, updatedAt: mockProfileData.updatedAt});});});