import { updateProfile } from '../../../../src/resolvers/mutations/profile/update-profile';
import { Profile } from '../../../../src/models/profile';

jest.mock('../../../../src/models/profile');

describe('updateProfile', () => {
  const mockInput = {
    bio: 'Updated bio',
    age: 26,
    images: ['image1.jpg', 'image2.jpg', 'image3.jpg']
  };

  const mockProfile = {
    _id: 'profile123',
    userId: 'user123',
    ...mockInput,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a profile successfully', async () => {
    (Profile.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProfile);

    const result = await updateProfile({}, { id: 'profile123', input: mockInput });
    expect(result).toEqual(mockProfile);
    expect(Profile.findByIdAndUpdate).toHaveBeenCalledWith(
      'profile123',
      { $set: mockInput },
      { new: true, runValidators: true }
    );
  });

  it('should throw error when profile not found', async () => {
    (Profile.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(updateProfile({}, { id: 'profile123', input: mockInput }))
      .rejects.toThrow('Profile not found');
  });

  it('should handle validation errors', async () => {
    const validationError = new Error('Validation failed');
    (Profile.findByIdAndUpdate as jest.Mock).mockRejectedValue(validationError);

    await expect(updateProfile({}, { id: 'profile123', input: mockInput }))
      .rejects.toThrow('Failed to update profile');
  });

  it('should handle database errors', async () => {
    const dbError = new Error('Database error');
    (Profile.findByIdAndUpdate as jest.Mock).mockRejectedValue(dbError);

    await expect(updateProfile({}, { id: 'profile123', input: mockInput }))
      .rejects.toThrow('Failed to update profile');
  });
}); 