import { updateProfile } from '../../../../src/resolvers/mutations/profile/update-profile';
import { Profile } from '../../../../src/models/profile';
import { GraphQLError } from 'graphql';

jest.mock('../../../../src/models/profile');

describe('updateProfile', () => {
  const mockInput = {
    bio: 'Updated bio',
    age: 26,
    images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
  };

  const mockProfile = {
    _id: 'profile123',
    userId: 'user123',
    ...mockInput,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a profile successfully', async () => {
    (Profile.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProfile);

    const result = await updateProfile({}, { id: 'profile123', input: mockInput });

    expect(Profile.findByIdAndUpdate).toHaveBeenCalledWith(
      'profile123',
      { $set: mockInput },
      { new: true, runValidators: true }
    );
    expect(result).toEqual(mockProfile);
  });

  it('should throw a GraphQLError when profile is not found', async () => {
    (Profile.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(updateProfile({}, { id: 'profile123', input: mockInput })).rejects.toThrow(
      new GraphQLError('Profile not found', { extensions: { code: 'NOT_FOUND' } })
    );
  });

  it('should throw a GraphQLError on validation error', async () => {
    const validationError = new Error('Validation failed');
    (Profile.findByIdAndUpdate as jest.Mock).mockRejectedValue(validationError);

    await expect(updateProfile({}, { id: 'profile123', input: mockInput })).rejects.toThrow(
      new GraphQLError('Failed to update profile', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      })
    );
  });

  it('should throw a GraphQLError on database error', async () => {
    const dbError = new Error('Database error');
    (Profile.findByIdAndUpdate as jest.Mock).mockRejectedValue(dbError);

    await expect(updateProfile({}, { id: 'profile123', input: mockInput })).rejects.toThrow(
      new GraphQLError('Failed to update profile', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      })
    );
  });
});
