import { GraphQLResolveInfo } from 'graphql';
import { RequestModel } from 'src/models';
import { updateRequest } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    findOne: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '67611496f1031b01f7e6c436',
        result: 'success',
        comment: 'good',
      })
      .mockResolvedValueOnce(null),
    findOneAndUpdate: jest.fn().mockReturnValue({
        // _id: '67611496f1031b01f7e6c436',
        // result: 'fail',
        // comment: 'not this time',
        _id: '67611496f1031b01f7e6c436',
        result: 'success',
        comment: 'good',
    }),
  },
}));

describe('find request by id', () => {
  const mockRequest = {
    _id: '67611496f1031b01f7e6c436',
    result: 'success',
    comment: 'good',
  };

  const updatedRequest = {
    ...mockRequest,
       _id: '67611496f1031b01f7e6c436',
        result: 'fail',
        comment: 'not this time',
  };

  it('should find request by id', async () => {
    (RequestModel.findOne as jest.Mock).mockResolvedValue(mockRequest);
    (RequestModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedRequest);
    const updatedRequestResult = await updateRequest?.(
      {},
      {     _id: '67611496f1031b01f7e6c436',
        result: 'fail',
        comment: 'not this time', },
      {},
      {} as GraphQLResolveInfo
    );
    expect(updatedRequestResult).toEqual(updatedRequest);
  });

  it('should throw error if request is not found', async () => {
    try {
      await updateRequest!({}, { _id: '67611496f1031b01f7e6c111',
        result: 'fail',
        comment: 'not this time', }, {}, {} as GraphQLResolveInfo);
    } catch (e) {
      await expect(e).toEqual(new Error("Request doesn't exist"));
    }
  });
});
