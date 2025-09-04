// __tests__/getAllProfiles-errors.test.ts
import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import {
  handleError,
  handleErrorObject,
  processGetAllProfilesRequest,
} from '../../../src/resolvers/queries/get-all-profiles';
import { Profile, Gender } from '../../../src/models/profile-model';

jest.mock('../../../src/models/profile-model', () => ({
  Profile: { find: jest.fn() },
  Gender: { MALE: 'male', FEMALE: 'female', BOTH: 'both' },
}));

const mockFind = Profile.find as jest.Mock;

describe('handleError', () => {
  it('re-throws GraphQL errors', () => {
    const error = new GraphQLError('Test error');
    expect(() => handleError(error)).toThrow('Test error');
  });

  it('handles Error objects with database messages', () => {
    const error = new Error('Database connection failed');
    expect(() => handleError(error)).toThrow('Database error');
  });

  it('handles Error objects with connection messages', () => {
    const error = new Error('connection timeout');
    expect(() => handleError(error)).toThrow('Database error');
  });

  it('handles generic Error objects', () => {
    const error = new Error('Something went wrong');
    expect(() => handleError(error)).toThrow('Failed to fetch profiles');
  });

  it('handles non-Error objects', () => {
    expect(() => handleError('string error')).toThrow('Failed to fetch profiles');
  });
});

describe('handleErrorObject', () => {
  it('handles database error messages', () => {
    const error = new Error('Database connection failed');
    expect(() => handleErrorObject(error)).toThrow('Database error');
  });

  it('handles connection error messages', () => {
    const error = new Error('connection timeout');
    expect(() => handleErrorObject(error)).toThrow('Database error');
  });

  it('handles generic error messages', () => {
    const error = new Error('Something went wrong');
    expect(() => handleErrorObject(error)).toThrow('Failed to fetch profiles');
  });
});

describe('processGetAllProfilesRequest', () => {
  beforeEach(() => mockFind.mockReset());

  it('processes profiles successfully', async () => {
    const profiles = [
      {
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
      },
    ];
    mockFind.mockResolvedValue(profiles);
    const result = await processGetAllProfilesRequest();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('John');
    expect(result[0].profession).toBe('Software Engineer');
    expect(result[0].likes).toEqual([]);
    expect(result[0].matches).toEqual([]);
  });

  it('handles empty profiles', async () => {
    mockFind.mockResolvedValue([]);
    const result = await processGetAllProfilesRequest();
    expect(result).toEqual([]);
  });

  it('handles database errors', async () => {
    mockFind.mockRejectedValue(new Error('Database error'));
    await expect(processGetAllProfilesRequest()).rejects.toThrow('Database error');
  });
});