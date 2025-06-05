/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { updateRequest } from 'src/resolvers/mutations';
import { RequestStatus, Response } from 'src/generated';
import { RequestModel } from 'src/models';

jest.mock('src/models', () => ({
  RequestModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateRequest mutation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error "Request not found"', async () => {
    (RequestModel.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      updateRequest!(
        {},
        {
          input: { id: '123' },
        },
        {},
        {} as GraphQLResolveInfo
      )
    ).rejects.toThrow('Request not found');
  });
  it('should throw error if value not exist', async () => {
    await expect(
      updateRequest!(
        {},
        {
          input: { id: '' },
        },
        {},
        {} as GraphQLResolveInfo
      )
    ).rejects.toThrow('Id required');
  });
  it('successfully updated', async () => {
    (RequestModel.findById as jest.Mock).mockResolvedValueOnce({ id: '12349' });

    (RequestModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({ id: '12349', status: RequestStatus.Done });

    const result = await updateRequest!({}, { input: { id: '12349' } }, {}, {} as GraphQLResolveInfo);

    expect(RequestModel.findById).toHaveBeenCalled();

    expect(RequestModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(result).toBe(Response.Success);
  });
});
