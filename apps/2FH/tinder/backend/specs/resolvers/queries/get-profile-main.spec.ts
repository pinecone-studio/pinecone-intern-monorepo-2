import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { getProfile } from '../../../src/resolvers/queries/get-profile';
import { Profile, Gender } from '../../../src/models/profile-model';
jest.mock('../../../src/models/profile-model', () => ({
  Profile: { 
    findOne: jest.fn(),
    find: jest.fn(),
  },
  Gender: { MALE: 'male', FEMALE: 'female', BOTH: 'both' },
}));
const mockProfile = {
  _id: new Types.ObjectId(),
  userId: new Types.ObjectId(),
  name: 'John Doe',
  gender: Gender.MALE,
  interestedIn: Gender.FEMALE,
  bio: 'Test bio',
  interests: ['coding', 'music'],
  profession: 'Developer',
  work: 'Tech Company',
  images: ['image1.jpg'],
  dateOfBirth: '1990-01-01',
  likes: [new Types.ObjectId()],
  matches: [new Types.ObjectId()],
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2020-01-02'),
};
const mockLikedProfile = {
  _id: new Types.ObjectId(),
  userId: new Types.ObjectId(),
  name: 'Jane Doe',
  gender: Gender.FEMALE,
  interestedIn: Gender.MALE,
  bio: 'Liked bio',
  interests: ['art', 'music'],
  profession: 'Designer',
  work: 'Design Company',
  images: ['image2.jpg'],
  dateOfBirth: '1992-01-01',
  likes: [],
  matches: [],
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2020-01-02'),
};
const mockMatchedProfile = {
  _id: new Types.ObjectId(),
  userId: new Types.ObjectId(),
  name: 'Bob Smith',
  gender: Gender.MALE,
  interestedIn: Gender.BOTH,
  bio: 'Matched bio',
  interests: ['sports', 'travel'],
  profession: 'Engineer',
  work: 'Engineering Company',
  images: ['image3.jpg'],
  dateOfBirth: '1988-01-01',
  likes: [],
  matches: [],
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2020-01-02'),
};
describe('getProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return profile with likes and matches successfully', async () => {
    const mockFindOne = Profile.findOne as jest.Mock;
    const mockFind = Profile.find as jest.Mock;
    mockFindOne.mockResolvedValue(mockProfile);
    mockFind.mockResolvedValue([mockLikedProfile, mockMatchedProfile]);
    const result = await (getProfile as any)(
      {},
      { userId: '507f1f77bcf86cd799439011' },
      {},
      {}
    );
    expect(mockFindOne).toHaveBeenCalledWith({ userId: new Types.ObjectId('507f1f77bcf86cd799439011') });
    expect(result).toBeDefined();
    expect(result.id).toBe(mockProfile._id.toHexString());
    expect(result.likes).toHaveLength(2);
    expect(result.matches).toHaveLength(2);
  });
  it('should throw error when profile not found', async () => {
    const mockFindOne = Profile.findOne as jest.Mock;
    mockFindOne.mockResolvedValue(null);
    await expect((getProfile as any)(
      {},
      { userId: '507f1f77bcf86cd799439011' },
      {},
      {}
    )).rejects.toThrow('Profile not found');
  });
  it('should handle invalid userId format', async () => {
    await expect((getProfile as any)(
      {},
      { userId: 'invalid' },
      {},
      {}
    )).rejects.toThrow('Invalid userId format');
  });
  it('should handle database errors', async () => {
    const mockFindOne = Profile.findOne as jest.Mock;
    mockFindOne.mockRejectedValue(new Error('Database connection failed'));
    await expect((getProfile as any)(
      {},
      { userId: '507f1f77bcf86cd799439011' },
      {},
      {}
    )).rejects.toThrow('Database error');
  });
  it('should handle connection errors', async () => {
    const mockFindOne = Profile.findOne as jest.Mock;
    mockFindOne.mockRejectedValue(new Error('connection timeout'));
    await expect((getProfile as any)(
      {},
      { userId: '507f1f77bcf86cd799439011' },
      {},
      {}
    )).rejects.toThrow('Database error');
  });
  it('should handle generic errors', async () => {
    const mockFindOne = Profile.findOne as jest.Mock;
    mockFindOne.mockRejectedValue(new Error('Something went wrong'));
    await expect((getProfile as any)(
      {},
      { userId: '507f1f77bcf86cd799439011' },
      {},
      {}
    )).rejects.toThrow('Failed to fetch profile');
  });
  it('should handle GraphQLError in handleError', async () => {
    const mockFindOne = Profile.findOne as jest.Mock;
    const graphqlError = new GraphQLError('Custom GraphQL error', { extensions: { code: 'CUSTOM_ERROR' } });
    mockFindOne.mockRejectedValue(graphqlError);
    await expect((getProfile as any)(
      {},
      { userId: '507f1f77bcf86cd799439011' },
      {},
      {}
    )).rejects.toThrow('Custom GraphQL error');
  });
  it('should handle unknown error type in handleError', async () => {
    const mockFindOne = Profile.findOne as jest.Mock;
    mockFindOne.mockRejectedValue('string error');
    await expect((getProfile as any)(
      {},
      { userId: '507f1f77bcf86cd799439011' },
      {},
      {}
    )).rejects.toThrow('Failed to fetch profile');
  });
});