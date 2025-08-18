// update-user.spec.ts
import { updateUser } from 'src/resolvers/mutations/user/update-user-mutation';
import { User } from 'src/models/user';
import { Gender } from 'src/generated';

jest.mock('src/models/user');

const mockUser = User as jest.Mocked<typeof User>;

beforeAll(() => {
  mockUser.findOne = jest.fn();
  mockUser.findById = jest.fn();
  mockUser.findByIdAndUpdate = jest.fn();
});

describe('User Mutations - updateUser', () => {
  const userId = 'user123';
  const existingUserData = {
    _id: userId,
    fullName: 'John Doe',
    userName: 'johndoe',
    email: 'john@example.com',
    gender: Gender.Male,
    isPrivate: false,
    isVerified: false,
    posts: [],
    stories: [],
    followers: [],
    followings: []
  };

  const mockContext = { req: { headers: { authorization: 'Bearer mock-token' } } };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser.findOne = jest.fn();
    mockUser.findById = jest.fn();
    mockUser.findByIdAndUpdate = jest.fn();
  });

  describe('Success Cases', () => {
    it('should update user successfully', async () => {
      const updateInput = { fullName: 'John Updated', userName: 'johnupdated' };
      const updatedUserData = { ...existingUserData, ...updateInput };
      const mockToObject = jest.fn().mockReturnValue(updatedUserData);

      mockUser.findById.mockResolvedValue(existingUserData as never);
      mockUser.findOne.mockResolvedValue(null);
      mockUser.findByIdAndUpdate.mockResolvedValue({
        ...updatedUserData, toObject: mockToObject
      } as never);

      const result = await updateUser(null, { _id: userId, input: updateInput }, mockContext);

      expect(mockUser.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(updatedUserData);
    });

    it('should update multiple fields without conflicts', async () => {
      const updateInput = {
        fullName: 'Jane Updated',
        userName: 'janeupdated',
        email: 'jane.updated@example.com'
      };
      const updatedUserData = { ...existingUserData, ...updateInput };
      const mockToObject = jest.fn().mockReturnValue(updatedUserData);

      mockUser.findById.mockResolvedValue(existingUserData as never);
      mockUser.findOne.mockResolvedValue(null);
      mockUser.findByIdAndUpdate.mockResolvedValue({
        ...updatedUserData, toObject: mockToObject
      } as never);

      const result = await updateUser(null, { _id: userId, input: updateInput }, mockContext);
      expect(result).toEqual(updatedUserData);
    });

    it('should skip conflict check when no updatable fields provided', async () => {
      const updateInput = { isPrivate: true };
      const updatedUserData = { ...existingUserData, isPrivate: true };
      const mockToObject = jest.fn().mockReturnValue(updatedUserData);

      mockUser.findById.mockResolvedValue(existingUserData as never);
      mockUser.findByIdAndUpdate.mockResolvedValue({
        ...updatedUserData, toObject: mockToObject
      } as never);

      const result = await updateUser(null, { _id: userId, input: updateInput }, mockContext);
      expect(mockUser.findOne).not.toHaveBeenCalled();
      expect(result).toEqual(updatedUserData);
    });

    it('should allow user to keep their own username/email/phone', async () => {
      const updateInput = {
        userName: 'johndoe',
        email: 'john@example.com',
        fullName: 'John Updated'
      };
      const updatedUserData = { ...existingUserData, fullName: 'John Updated' };
      const mockToObject = jest.fn().mockReturnValue(updatedUserData);

      mockUser.findById.mockResolvedValue(existingUserData as never);
      mockUser.findOne.mockResolvedValue(null);
      mockUser.findByIdAndUpdate.mockResolvedValue({
        ...updatedUserData, toObject: mockToObject
      } as never);

      const result = await updateUser(null, { _id: userId, input: updateInput }, mockContext);
      expect(result).toEqual(updatedUserData);
    });
  });
});