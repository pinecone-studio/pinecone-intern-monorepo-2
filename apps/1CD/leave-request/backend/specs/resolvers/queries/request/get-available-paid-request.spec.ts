import { checkAvailablePaidLeaveInGivenYear } from '../../../../src/resolvers/queries';
import { GraphQLResolveInfo } from 'graphql';

jest.setTimeout(15000);

jest.mock('../../../../src/models/user', () => ({
  UserModel: {
    findOne: jest.fn().mockResolvedValueOnce({ hireDate: new Date('2022-12-03T10:03:41.302+00:00') }),
  },
}));

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    find: jest.fn().mockResolvedValue([]),
  },
}));

describe('checkAvailablePaidLeaveInGivenYear', () => {
  it('should return available paid leave for this and next year when user exists', async () => {
    const result = await checkAvailablePaidLeaveInGivenYear!({}, { email: 'test@example.com' }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      thisYear: 40,
      nextYear: 40,
    });
  });

  it('should throw an error if user is not found', async () => {
    try {
      await checkAvailablePaidLeaveInGivenYear!({}, { email: 'test@example.com' }, {}, {} as GraphQLResolveInfo);
    } catch (e) {
      expect(e).toEqual(new Error('User not found'));
    }
  });
});
