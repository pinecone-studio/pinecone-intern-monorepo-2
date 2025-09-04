// __tests__/getAllProfiles-helpers.test.ts
import { Types } from 'mongoose';
import {
  formatWorkProfile,
  formatSingleProfile,
  fetchAllProfiles,
} from '../../../src/resolvers/queries/get-all-profiles';
import { Profile, Gender } from '../../../src/models/profile-model';
import { Gender as GraphQLGender } from '../../../src/generated';

jest.mock('../../../src/models/profile-model', () => ({
  Profile: { find: jest.fn() },
  Gender: { MALE: 'male', FEMALE: 'female', BOTH: 'both' },
}));

const mockFind = Profile.find as jest.Mock;

describe('formatWorkProfile', () => {
  it('formats work profile correctly', () => {
    const profile = {
      _id: new Types.ObjectId(),
      userId: new Types.ObjectId(),
      profession: 'Software Engineer',
      work: 'Tech Company',
      images: ['image1.jpg', 'image2.jpg'],
      dateOfBirth: '1990-01-01',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-02'),
    };
    const result = formatWorkProfile(profile as any);
    expect(result.profession).toBe('Software Engineer');
    expect(result.work).toBe('Tech Company');
    expect(result.images).toEqual(['image1.jpg', 'image2.jpg']);
    expect(result.dateOfBirth).toMatch(/1990-01-01T/);
    expect(result.createdAt).toMatch(/2020-01-01T/);
    expect(result.updatedAt).toMatch(/2020-01-02T/);
  });

  it('handles missing work profile fields', () => {
    const profile = {
      _id: new Types.ObjectId(),
      userId: new Types.ObjectId(),
      profession: null,
      work: null,
      images: null,
      dateOfBirth: null,
      createdAt: null,
      updatedAt: undefined,
    };
    const result = formatWorkProfile(profile as any);
    expect(result.profession).toBe('');
    expect(result.work).toBe('');
    expect(result.images).toEqual([]);
    expect(result.dateOfBirth).toBe('');
    expect(result.createdAt).toMatch(/T/);
    expect(result.updatedAt).toMatch(/T/);
  });
});

describe('formatSingleProfile', () => {
  it('formats single profile correctly', () => {
    const profile = {
      _id: new Types.ObjectId(),
      userId: new Types.ObjectId(),
      name: 'John',
      gender: Gender.MALE,
      bio: 'Developer',
      interests: ['coding'],
      profession: 'Software Engineer',
      work: 'Tech Company',
      images: ['image1.jpg'],
      dateOfBirth: '1990-01-01',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-02'),
    };
    const result = formatSingleProfile(profile as any);
    expect(result.id).toBe(profile._id.toHexString());
    expect(result.userId).toBe(profile.userId.toHexString());
    expect(result.name).toBe('John');
    expect(result.gender).toBe(GraphQLGender.Male);
    expect(result.bio).toBe('Developer');
    expect(result.interests).toEqual(['coding']);
    expect(result.profession).toBe('Software Engineer');
    expect(result.work).toBe('Tech Company');
    expect(result.images).toEqual(['image1.jpg']);
    expect(result.dateOfBirth).toMatch(/1990-01-01T/);
    expect(result.createdAt).toMatch(/2020-01-01T/);
    expect(result.updatedAt).toMatch(/2020-01-02T/);
    expect(result.likes).toEqual([]);
    expect(result.matches).toEqual([]);
  });
});

describe('fetchAllProfiles', () => {
  beforeEach(() => mockFind.mockReset());

  it('fetches all profiles successfully', async () => {
    const profiles = [
      { _id: new Types.ObjectId(), name: 'John' },
      { _id: new Types.ObjectId(), name: 'Jane' },
    ];
    mockFind.mockResolvedValue(profiles);
    const result = await fetchAllProfiles();
    expect(result).toEqual(profiles);
    expect(mockFind).toHaveBeenCalledTimes(1);
  });

  it('handles database errors', async () => {
    mockFind.mockRejectedValue(new Error('Database error'));
    await expect(fetchAllProfiles()).rejects.toThrow('Database error');
  });
});