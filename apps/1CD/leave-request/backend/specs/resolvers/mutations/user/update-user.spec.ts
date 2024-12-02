import { GraphQLResolveInfo } from 'graphql';
import { UserModel } from 'src/models';
import { updateUser } from 'src/resolvers/mutations';


jest.mock('../../../src/models', () => ({
  userModel: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

describe('find user by ID', () => {
  const mockUser = {
    email: 'zul@gmail.com',
    userName: 'zula',
    role: 'engineer',
    profile: '',
    position: 'Developer',
    supervisor: 'yes',
    hireDate:'2022.07'
  };

  const updatedUser = {
    ...mockUser,
    email: 'zulaa@gmail.com',
    userName: 'zula',
    role: 'engineer',
    profile: '',
    position: 'Developer',
    supervisor: 'yes',
    hireDate:'2022.07'
  };

  it('should find user by ID', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
    const updateduser = await updateUser?.(
      {},
      {  email: 'zul@gmail.com',
        userName: 'zula',
        role: 'engineer',
        profile: '',
        position: 'Developer',
        supervisor: 'yes',
        hireDate:'2022.07' },
      {},
      {} as GraphQLResolveInfo
    );
    expect(updateduser).toEqual(updatedUser);
  });

  it('should throw error', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    expect(
      updateUser?.(
        {},
        { email: 'zulaa@gmail.com',
            userName: 'zula',
            role: 'engineer',
            profile: '',
            position: 'Developer',
            supervisor: 'yes',
            hireDate:'2022.07' },
        {},
        {} as GraphQLResolveInfo
      )
    ).rejects.toThrow('Could not find user');
  });
});
