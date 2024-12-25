import { GraphQLResolveInfo } from 'graphql';
import { updateUser } from '../../../../src/resolvers/mutations';
import { userModel } from '../../../../src/models';


jest.mock('../../../../src/models', () => ({
  userModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('find user by ID', () => {
  const mockUser = {
    name: 'Sara',
    bio: 'Traveler',
    interests: ['Reading', 'Traveling'],
    profession: 'Developer',
    schoolWork: ['School', 'Work'],
  };

  const updatedUser = {
   email:'cypress@gmail.com'
  };
  const userId="675675e84bd85fce3de34006"

  it('should find user by ID', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
    const updateduser = await updateUser!(
      {},
      {name: 'Sarah', bio: 'singer', interests: ['Dancing', 'Traveling'], profession: 'Software Engineer', schoolWork: ['university', 'school'] },
      {userId},
      {} as GraphQLResolveInfo
    );
    expect(updateduser).toEqual(updatedUser);
  });

  
});