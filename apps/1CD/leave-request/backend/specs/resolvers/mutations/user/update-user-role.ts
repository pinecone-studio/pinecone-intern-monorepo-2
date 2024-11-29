import { GraphQLResolveInfo } from 'graphql';


jest.mock('../../../src/models', () => ({
  user: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('find user by ID', () => {
  const mockUser = {
    email: 'zulaa@gmail.com',
    name: 'zula',
    role: "supervisor",
    position:"engineer",
    supervisor: "zula"

  };

  const updatedUserRole = {
    ...mockUser,
    name: 'Sarah',
    bio: 'singer',
    interests: ['Dancing', 'Traveling'],
    profession: 'Software Engineer',
    schoolWork: ['university', 'school'],
  };

});
import { GraphQLResolveInfo } from 'graphql';
import { updateUser } from '../../../src/resolvers/mutations';
import { userModel } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  userModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('find user by ID', () => {
  const mockUser = {
    _id: '123',
    name: 'Sara',
    bio: 'Traveler',
    interests: ['Reading', 'Traveling'],
    profession: 'Developer',
    schoolWork: ['School', 'Work'],
  };

  const updatedUser = {
    ...mockUser,
    name: 'Sarah',
    bio: 'singer',
    interests: ['Dancing', 'Traveling'],
    profession: 'Software Engineer',
    schoolWork: ['university', 'school'],
  };

  it('should find user by ID', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
    const updateduser = await updateUser!(
      {},
      { _id: '123', name: 'Sarah', bio: 'singer', interests: ['Dancing', 'Traveling'], profession: 'Software Engineer', schoolWork: ['university', 'school'] },
      {},
      {} as GraphQLResolveInfo
    );
    expect(updateduser).toEqual(updatedUser);
  });

  it('should throw error', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue(null);

    expect(
      updateUser!(
        {},
        { _id: '123', name: 'Sarah', bio: 'singer', interests: ['Dancing', 'Traveling'], profession: 'Software Engineer', schoolWork: ['university', 'school'] },
        {},
        {} as GraphQLResolveInfo
      )
    ).rejects.toThrow('Could not find user');
  });
});
