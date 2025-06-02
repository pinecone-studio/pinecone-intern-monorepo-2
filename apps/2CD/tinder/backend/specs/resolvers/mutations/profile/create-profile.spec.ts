import { createProfile } from '../../../../src/resolvers/mutations/profile/create-profile';
import { Profile } from '../../../../src/models/profile';
import type { CreateProfileInput } from '../../../../src/resolvers/mutations/profile/create-profile';

jest.mock('../../../../src/models/profile');

describe('createProfile', () => {
  const mockInput: CreateProfileInput = {
    userId: 'user123',
    age: 25,
    gender: 'Male' as const,
    lookingFor: 'Female' as const,
    bio: 'Test bio',
    images: ['image1.jpg', 'image2.jpg'],
    location: {
      type: 'Point' as const,
      coordinates: [0, 0]
    }
  };

  const mockProfile = {
    _id: 'profile123',
    ...mockInput,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new profile successfully', async () => {
    const mockSave = jest.fn().mockResolvedValue(mockProfile);
    const mockProfileInstance = {
      ...mockProfile,
      save: mockSave
    };
    (Profile as unknown as jest.Mock).mockReturnValue(mockProfileInstance);

    const result = await createProfile({}, { input: mockInput });

    expect(result).toEqual(mockProfileInstance);
    expect(Profile).toHaveBeenCalledWith(mockInput);
    expect(mockSave).toHaveBeenCalled();
  });

  it('should handle validation errors', async () => {
    const mockSave = jest.fn().mockRejectedValue(new Error('Validation failed'));
    const mockProfileInstance = {
      save: mockSave
    };
    (Profile as unknown as jest.Mock).mockReturnValue(mockProfileInstance);

    await expect(createProfile({}, { input: mockInput })).rejects.toThrow('Validation failed');
  });

  it('should handle database errors', async () => {
    const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
    const mockProfileInstance = {
      save: mockSave
    };
    (Profile as unknown as jest.Mock).mockReturnValue(mockProfileInstance);

    await expect(createProfile({}, { input: mockInput })).rejects.toThrow('Database error');
  });
}); 