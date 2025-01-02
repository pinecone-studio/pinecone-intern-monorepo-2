import { GraphQLResolveInfo } from 'graphql';
import { openRequest } from 'src/resolvers/queries';

jest.setTimeout(15000);

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    findById: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '67611496f1031b01f7e6c436',
        email: 'mock@gmail.com',
        result: 'success',
      })
      .mockResolvedValueOnce({
        _id: '67611496f1031b01f7e6c436',
        email: 'mock@gmail.com',
        result: 'success',
        toObject: jest.fn().mockReturnValue({ _id: '67611496f1031b01f7e6c436', email: 'test@example.com', result: 'success' }),
      })
      .mockResolvedValueOnce({
        _id: '67611496f1031b01f7e6c436',
        email: 'mock@gmail.com',
        result: 'sent',
      }),
    findByIdAndUpdate: jest.fn().mockResolvedValue({
      _id: '67611496f1031b01f7e6c436',
      email: 'mock@gmail.com',
      result: 'pending',
      toObject: jest.fn().mockReturnValue({ _id: '67611496f1031b01f7e6c436', email: 'test@example.com', result: 'pending' }),
    }),
  },
}));

jest.mock('../../../../src/models/user', () => ({
  UserModel: {
    findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ userName: 'Zoljargal' }).mockResolvedValueOnce({ userName: 'Zoljargal' }),
  },
}));

describe('open request backend test', () => {
  it('user not found', async () => {
    try {
      await openRequest!({}, { _id: '67611496f1031b01f7e6c436' }, {}, {} as GraphQLResolveInfo);
    } catch (e) {
      expect(e).toEqual(new Error('user not found'));
    }
  });
  it('should get success request', async () => {
    const task = await openRequest!({}, { _id: '67611496f1031b01f7e6c436' }, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual({
      _id: '67611496f1031b01f7e6c436',
      result: 'success',
      email: 'test@example.com',
      userName: 'Zoljargal',
    });
  });
  it("should update the request result entity 'pending'", async () => {
    const task = await openRequest!({}, { _id: '67611496f1031b01f7e6c436' }, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual({
      _id: '67611496f1031b01f7e6c436',
      result: 'pending',
      email: 'test@example.com',
      userName: 'Zoljargal',
    });
  });
});
