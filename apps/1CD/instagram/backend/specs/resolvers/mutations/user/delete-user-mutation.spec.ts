import { GraphQLResolveInfo } from 'graphql';
import { deleteUser } from 'src/resolvers/mutations';

jest.mock('../../../../src/models/user.model.ts', () => ({
  userModel: {
    findByIdAndDelete: jest.fn().mockReturnValueOnce({ _id: 'a' }).mockReturnValueOnce(null),
  },
}));

describe('Delete user', () => {
  it('should delete user', async () => {
    const response = await deleteUser!({}, { _id: 'a' }, { userId: null }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: 'a',
    });
  });

  it('should throw an error', async () => {
    try {
      await deleteUser!({}, { _id: 'a' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Could not delete user'));
    }
  });
});
