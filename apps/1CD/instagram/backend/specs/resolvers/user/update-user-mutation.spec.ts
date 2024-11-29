/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { updateUserData } from '../../../src/resolvers/mutations';

jest.mock('../../../src/models/user.model.ts', () => ({
  userModel: {
    findByIdAndUpdate: jest
      .fn()
      .mockReturnValueOnce({
        _id: '1',
        userName: 'uk',
        fullName: 'uu',
        bio: 'g',
        gender: 'male',
        profileImg: 'img',
        accountVisibility: 'PUBLIC',
      })
      .mockReturnValueOnce(null),
  },
}));

const input = {
  _id: '1',
  userName: 'uk',
  fullName: 'uu',
  bio: 'g',
  gender: 'male',
  profileImg: 'img',
  accountVisibility: 'PUBLIC',
};
describe('Update user data', () => {
  it('should update user data', async () => {
    const result = await updateUserData!(
      {},
      {
        input,
      },
      {},
      {} as GraphQLResolveInfo
    );

    expect(result).toEqual({
      _id: '1',
      userName: 'uk',
      fullName: 'uu',
      bio: 'g',
      gender: 'male',
      profileImg: 'img',
      accountVisibility: 'PUBLIC',
    });
  });
  it('should throw user data', async () => {
    try {
      await updateUserData!(
        {},
        {
          input,
        },
        {},
        {} as GraphQLResolveInfo
      );
    } catch (error) {
      expect(error).toEqual(new Error('Could not update user data'));
    }
  });
});
