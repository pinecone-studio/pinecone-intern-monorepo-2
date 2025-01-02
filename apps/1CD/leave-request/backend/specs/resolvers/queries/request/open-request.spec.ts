import { GraphQLResolveInfo } from 'graphql';
import { openRequest } from 'src/resolvers/queries';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    findById: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '67611496f1031b01f7e6c436',
        result: 'success',
      })
      .mockResolvedValueOnce({
        _id: '67611496f1031b01f7e6c436',
        result: 'sent',
      }),
    findByIdAndUpdate: jest.fn().mockResolvedValue({
      _id: '67611496f1031b01f7e6c436',
      result: 'pending',
    }),
  },
}));

describe('open request backend test', () => {
  it('should get success request', async () => {
    const task = await openRequest!({}, { _id: '67611496f1031b01f7e6c436' }, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual({
      _id: '67611496f1031b01f7e6c436',
      result: 'success',
    });
  });
  it("should update the request result entity 'pending'", async () => {
    const task = await openRequest!({}, { _id: '67611496f1031b01f7e6c436' }, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual({
      _id: '67611496f1031b01f7e6c436',
      result: 'pending',
    });
  });
});
