import { GraphQLResolveInfo } from 'graphql';
import { UserModel } from 'src/models';
import { updateUser } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models/user', () => ({
  UserModel: {
    findOne: jest
      .fn()
      .mockResolvedValueOnce({
        email: 'zul@gmail.com',
        userName: 'zula',
        role: 'engineer',
        profile: '',
        position: 'Developer',
        supervisor: 'yes',
        hireDate: '2022.07.11',
      })
      .mockResolvedValueOnce(null),
    findOneAndUpdate: jest.fn().mockReturnValue({
      email: 'zul@gmail.com',
      userName: 'zula',
      role: 'engineer',
      profile: '',
      position: 'Developer',
      supervisor: 'yes',
      hireDate: '2022.07.11',
    }),
  },
}));

describe('find user by email', () => {
  const mockUser = {
    email: 'zul@gmail.com',
    userName: 'zula',
    role: 'engineer',
    profile: '',
    position: 'Developer',
    supervisor: 'yes',
    hireDate: '2022.07',
  };

  const updatedUser = {
    ...mockUser,
    email: 'zulaa@gmail.com',
    userName: 'zula',
    role: 'engineer',
    profile: '',
    position: 'Developer',
    supervisor: 'yes',
    hireDate: '2022.08',
  };

  it('should find user by email', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
    const updatedUserResult = await updateUser?.(
      {},
      { email: 'zoloo@gmail.com', userName: 'zula', role: 'engineer', profile: '', position: 'Developer', supervisor: [], hireDate: '2022.08' },
      {},
      {} as GraphQLResolveInfo
    );
    expect(updatedUserResult).toEqual(updatedUser);
  });

  it('should throw error if user is not found', async () => {
    try {
      await updateUser!({}, { email: 'zoloo@gmail.com', userName: 'zula', role: 'engineer', profile: '', position: 'Developer', supervisor: [] }, {}, {} as GraphQLResolveInfo);
    } catch (e) {
      await expect(e).toEqual(new Error("User doesn't exist in this email"));
    }
  });
});
