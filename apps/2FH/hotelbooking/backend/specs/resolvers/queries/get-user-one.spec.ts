import { UserModel } from 'src/models';
import { getUserOne } from 'src/resolvers/queries/user/get-user-one';

jest.mock('src/models', () => ({
  UserModel: { findOne: jest.fn() },
}));

describe('Get one user', () => {
  it('throws when user not found', async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const input = { email: 'missing@example.com' };

    await expect(getUserOne({}, { input })).rejects.toThrow(`User with email ${input.email} not found`);
  });

  it('throws on db error', async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('db error')),
    });

    const input = { email: 'any@example.com' };

    await expect(getUserOne({}, { input })).rejects.toThrow('Error fetching user: Error: db error');
  });

  it('returns user on success', async () => {
    const user = { firstName: 'A', lastName: 'B', email: 'ok@example.com', role: 'user', dateOfBirth: '2000-01-01' };
    (UserModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });

    const input = { email: 'ok@example.com' };
    await expect(getUserOne({}, { input })).resolves.toEqual(user);
  });
});
