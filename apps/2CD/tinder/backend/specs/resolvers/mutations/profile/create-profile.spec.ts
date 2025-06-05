import { createProfile } from '../../../../src/resolvers/mutations/profile/create-profile';
import { Profile } from '../../../../src/models/profile';
import { CreateProfileInput } from 'src/types/profile';

jest.mock('../../../../src/models/profile');

describe('createProfile', () => {
  const mockInput: CreateProfileInput = {
    userId: 'user123',
    firstName: 'John',
    age: 25,
    gender: 'Male',
    lookingFor: 'Female',
    bio: 'Test bio',
    interests: ['hiking', 'reading'],
    profession: 'Engineer',
    education: 'BSc Computer Science',
    images: ['image1.jpg', 'image2.jpg'],
    isCertified: true,
    location: {
      type: 'Point',
      coordinates: [0, 0],
    },
  };

  const mockProfile = {
    _id: 'profile123',
    ...mockInput,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new profile successfully', async () => {
    const mockSave = jest.fn().mockResolvedValue(mockProfile);
    const mockProfileInstance = { ...mockProfile, save: mockSave };

    (Profile as unknown as jest.Mock).mockImplementation(() => mockProfileInstance);

    const result = await createProfile({}, { input: mockInput });

    expect(Profile).toHaveBeenCalledWith(mockInput);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(mockProfileInstance);
  });

  it('should handle validation errors', async () => {
    const mockSave = jest.fn().mockRejectedValue(new Error('Validation failed'));
    const mockProfileInstance = { save: mockSave };

    (Profile as unknown as jest.Mock).mockImplementation(() => mockProfileInstance);

    await expect(createProfile({}, { input: mockInput })).rejects.toThrow('Validation failed');
  });

  it('should handle database errors', async () => {
    const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
    const mockProfileInstance = { save: mockSave };

    (Profile as unknown as jest.Mock).mockImplementation(() => mockProfileInstance);

    await expect(createProfile({}, { input: mockInput })).rejects.toThrow('Database error');
  });
});
