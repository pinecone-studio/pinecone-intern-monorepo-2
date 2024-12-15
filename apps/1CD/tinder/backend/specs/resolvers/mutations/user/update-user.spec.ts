import { GraphQLResolveInfo } from 'graphql';
import { updateUser } from '../../../../src/resolvers/mutations';
import { userModel } from '../../../../src/models';


jest.mock('../../../../src/models', () => ({
  userModel: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('find user by email', () => {
  const mockUser = {
    email: 'anna@gmail.com',
    name: 'Sara',
    bio: 'Traveler',
    interests: ['Reading', 'Traveling'],
    profession: 'Developer',
    schoolWork: ['School', 'Work'],
  };
  const userId='675675e84bd85fce3de34006'
  const updatedUser = {
    ...mockUser,
    name: 'Sarah',
    bio: 'singer',
    interests: ['Dancing', 'Traveling'],
    profession: 'Software Engineer',
    schoolWork: ['university', 'school'],
  };
  it('should find user by email and update', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
    const updateduser = await updateUser!(
      {},
      {  email: 'anna@gmail.com', name: 'Sarah', bio: 'singer', interests: ['Dancing', 'Traveling'], profession: 'Software Engineer', schoolWork: ['university', 'school'] },
      {userId},
      {} as GraphQLResolveInfo
    );
    expect(updateduser).toEqual(updatedUser);
  });

  it('should throw error', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    
      await expect( updateUser!(
        {},
        {  email: 'anna@gmail.com', name: 'Sarah', bio: 'singer', interests: ['Dancing', 'Traveling'], profession: 'Software Engineer', schoolWork: ['university', 'school'] },
        {userId},
        {} as GraphQLResolveInfo
      )).rejects.toThrow("Could not find user") 
   

   
  });
  it('should throw internal server error', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (userModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database connection failed'));
    await expect(
      updateUser!(
        {},
        { 
          email: 'anna@gmail.com', 
          name: 'Sarah', 
          bio: 'singer', 
          interests: ['Dancing', 'Traveling'], 
          profession: 'Software Engineer', 
          schoolWork: ['university', 'school'] 
        },
        {userId},
        {} as GraphQLResolveInfo
      )
    ).rejects.toThrow('Internal server error');
  });
  
});