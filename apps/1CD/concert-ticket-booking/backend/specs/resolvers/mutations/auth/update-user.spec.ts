import { updateUser } from '../../../../src/resolvers/mutations/auth/update-user';
import { GraphQLResolveInfo } from 'graphql';

import User from '../../../../src/models/user.model';

jest.mock('../../../../src/models/user.model', () => ({
  findByIdAndUpdate: jest.fn(),
}));

describe('update user info', () => {
  it('should update user data ', async () => {
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
      _id: '1',
      email: 'test@gmail.com',
      phoneNumber: '99898988',
    });

    const result = await updateUser!({}, { input: { email: 'test@gmail.com', phoneNumber: '99898989' } }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      email: 'test@gmail.com',
      phoneNumber: '99898988',
      _id: '1',
    });
  });
  it('should throw an error if user is not found', async () => {
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);
    try {
      await updateUser!({}, { input: { email: 'test@email.com', phoneNumber: '99898989' } }, { userId: '2' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('User not found'));
    }
  });
});
