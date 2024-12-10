import { checkAvailavleRemoteLeaveInGivenMonth } from '../../../../src/resolvers/queries';
import { GraphQLResolveInfo } from 'graphql';

jest.setTimeout(15000);

jest.mock('../../../../src/models/user', () => ({
  UserModel: {
    findOne: jest.fn().mockResolvedValueOnce({ hireDate: new Date('2022-12-03T10:03:41.302+00:00') }),
  },
}));

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    find: jest.fn(() => ({
      countDocuments: jest.fn().mockResolvedValueOnce(2),
    })),
  },
}));

describe('checkAvailablePaidLeaveInGivenYear', () => {
  it('should return available paid leave for this and next year when user exists', async () => {
    const result = await checkAvailavleRemoteLeaveInGivenMonth!({}, { email: 'test@example.com' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      thisMonth: 3,
      nextMonth: 3,
    });
  });

  it('should throw an error if user is not found', async () => {
    try {
      await checkAvailavleRemoteLeaveInGivenMonth!({}, { email: 'test@example.com' }, {}, {} as GraphQLResolveInfo);
    } catch (e) {
      expect(e).toEqual(new Error('User not found'));
    }
  });
});
