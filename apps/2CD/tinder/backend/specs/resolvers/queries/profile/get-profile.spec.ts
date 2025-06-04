import { getProfile } from '../../../../src/resolvers/queries/profile/get-profile';
import { Profile } from '../../../../src/models/profile';

jest.mock('../../../../src/models/profile');

describe('getProfile', () => {
  const mockProfile = {
    _id: 'profile123',
    userId: 'user123',
    age: 25,
    gender: 'Male',
    lookingFor: 'Female',
    bio: 'Test bio',
    images: ['image1.jpg', 'image2.jpg'],
    location: {
      type: 'Point',
      coordinates: [100, 50]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a profile when found', async () => {
    (Profile.findById as jest.Mock).mockResolvedValue(mockProfile);
    
    const result = await getProfile({}, { id: 'profile123' });
    expect(result).toEqual(mockProfile);
    expect(Profile.findById).toHaveBeenCalledWith('profile123');
  });

  it('should return null when profile not found', async () => {
    (Profile.findById as jest.Mock).mockResolvedValue(null);
    
    const result = await getProfile({}, { id: 'nonexistent' });
    expect(result).toBeNull();
    expect(Profile.findById).toHaveBeenCalledWith('nonexistent');
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Database error');
    (Profile.findById as jest.Mock).mockRejectedValue(error);
    
    await expect(getProfile({}, { id: 'profile123' })).rejects.toThrow('Database error');
    expect(Profile.findById).toHaveBeenCalledWith('profile123');
  });
}); 