import { GraphQLResolveInfo } from 'graphql';
import { createsRequest } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/utils/check-token', () => ({
  checkToken: jest.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false),
}));
jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    create: jest.fn().mockResolvedValue({
      email: 'Zolo@gmail.com',
      requestDate: '2024-12-05T08:48:29.417Z',
      requestType: 'paid',
      message: 'Headache',
      supervisorEmail: 'zolookorzoloo@gmail.com',
    }),
  },
}));

describe('check if create request is working properly', () => {
  const mockRequest = { email: 'Zolo@gmail.com', requestDate: '2024-12-05T08:48:29.417Z', requestType: 'paid', message: 'Headache', supervisorEmail: 'zolookorzoloo@gmail.com' };
  it('in correct token', async () => {
    const res = await createsRequest!(
      {},
      { email: 'Zolo@gmail.com', requestDate: '2024-12-05T08:48:29.417Z', requestType: 'paid', message: 'Headache', supervisorEmail: 'zolookorzoloo@gmail.com' },
      {},
      {} as GraphQLResolveInfo
    );
    expect(res).toEqual(mockRequest);
  });
  it('token is not valid', async () => {
    try {
      await createsRequest!(
        {},
        { email: 'Zolo@gmail.com', requestDate: '2024-12-05T08:48:29.417Z', requestType: 'paid', message: 'Headache', supervisorEmail: 'zolookorzoloo@gmail.com' },
        {},
        {} as GraphQLResolveInfo
      );
    } catch (e) {
      expect(e).toEqual(new Error('Not authorized'));
    }
  });
});
