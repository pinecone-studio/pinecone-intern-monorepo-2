import { getUser } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  userModel: {
    findOne: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '1',
        email: 'test',
      })
      .mockResolvedValueOnce(null),
  },
}));

describe("get user query's test", () => {
  it('found user by email', async () => {
    const result = await getUser({}, { email: 'test' });
    expect(result).toEqual({ _id: '1', email: 'test' });
  });
  it('not found entered email', async () => {
    try {
      await getUser({}, { email: 'test' });
    } catch (err) {
      expect((err as Error).message).toEqual('email is not found');
    }
  });
});
