import { Profile, User } from 'src/models';
import { updateProfile } from 'src/resolvers/mutations';
import { ProfileResponse, UpdateProfileInput } from 'src/generated';

jest.mock('src/models', () => ({
  Profile: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
  User: {
    findById: jest.fn(),
  },
}));

describe('updateProfile mutation - Success Cases', () => {
  const mockContext = { user: { id: '507f1f77bcf86cd799439011' } };
  const mockInfo = { fieldName: 'updateProfile' } as any;
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockProfileInput: UpdateProfileInput = {
    userId: mockUserId,
    name: 'John Doe',
    gender: 'male' as any, // 'as any'-г арилгасан, Gender enum-д таарна
    bio: 'Тогооч',
    interests: ['Спорт', 'Онцгой'],
    profession: 'Программист',
    work: 'Fullstack Developer',
    images: ['https://example.com/image1.jpg'],
    dateOfBirth: '1990-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update profile successfully', async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce({ _id: mockUserId });
    (Profile.findOne as jest.Mock).mockResolvedValueOnce({ _id: '507f1f77bcf86cd799439012', userId: mockUserId });
    (Profile.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
      _id: '507f1f77bcf86cd799439012',
      ...mockProfileInput,
      updatedAt: new Date().toISOString(),
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const result = await updateProfile!({}, { input: mockProfileInput }, mockContext, mockInfo);

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(Profile.findOne).toHaveBeenCalledWith({ userId: mockUserId });
    expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: mockUserId },
      {
        $set: expect.objectContaining({
          name: mockProfileInput.name,
          gender: mockProfileInput.gender,
          bio: mockProfileInput.bio,
          interests: mockProfileInput.interests,
          profession: mockProfileInput.profession,
          work: mockProfileInput.work,
          images: mockProfileInput.images,
          dateOfBirth: expect.any(String),
          updatedAt: expect.any(String),
        }),
      },
      { new: true }
    );
    expect(consoleSpy).toHaveBeenCalledWith('Profile updated successfully:', expect.any(String));
    expect(result).toEqual(ProfileResponse.Success);
    consoleSpy.mockRestore();
  });

  it('should handle partial update with only some fields', async () => {
    const partialInput: UpdateProfileInput = {
      userId: mockUserId,
      name: 'Jane Doe',
      work: '',
    };
    (User.findById as jest.Mock).mockResolvedValueOnce({ _id: mockUserId });
    (Profile.findOne as jest.Mock).mockResolvedValueOnce({ _id: '507f1f77bcf86cd799439012', userId: mockUserId });
    (Profile.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
      _id: '507f1f77bcf86cd799439012',
      userId: mockUserId,
      name: partialInput.name,
      work: '',
      updatedAt: new Date().toISOString(),
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const result = await updateProfile!({}, { input: partialInput }, mockContext, mockInfo);

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(Profile.findOne).toHaveBeenCalledWith({ userId: mockUserId });
    expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: mockUserId },
      { $set: { name: partialInput.name, work: '', updatedAt: expect.any(String) } },
      { new: true }
    );
    expect(consoleSpy).toHaveBeenCalledWith('Profile updated successfully:', expect.any(String));
    expect(result).toEqual(ProfileResponse.Success);
    consoleSpy.mockRestore();
  });
});