// import { userModel } from '../../../../src/models';

import { GraphQLResolveInfo } from 'graphql';
import { updateProfile } from '../../../../src/resolvers/mutations';
import { userModel } from 'src/models';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('update-profile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const input = { firstName: 'test', lastName: 'test' };

  it('should throw Must login first error', async () => {
    try {
      await updateProfile!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Must login first'));
    }
  });
  it('should update data', async () => {
    const updatedProfile = {
      _id: '1',
      email: '',
      firstName: 'test',
      lastName: 'test',
      dateOfBirth: '2017-06-01T00:00:00.000Z',
      phoneNumber: '11111111',
      emergencyContact: '12333123',
      createdAt: '2024-12-16T02:02:24.952Z',
    };
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedProfile);

    const result = await updateProfile!({}, { input }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(result).toEqual(updatedProfile);
  });
});
