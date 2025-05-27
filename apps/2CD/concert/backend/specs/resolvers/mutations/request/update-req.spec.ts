import { GraphQLResolveInfo } from 'graphql';
import { updateRequest } from 'src/resolvers/mutations';
import { RequestStatus } from 'src/generated';
import * as Models from 'src/models';

jest.mock('src/models', () => ({
  RequestModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    insertMany: jest.fn(),
  },
}));

describe('updateRequest mutation', () => {
  it('should throw error "Request not found"', async () => {
    const { RequestModel } = Models;

    (RequestModel.findById as jest.Mock).mockResolvedValueOnce(null);
    (RequestModel.insertMany as jest.Mock).mockResolvedValueOnce({ id: '12345', status: RequestStatus.Pending });

    await expect(
      updateRequest!(
        {},
        {
          input: { id: '12349', status: RequestStatus.Pending },
        },
        {},
        {} as GraphQLResolveInfo
      )
    ).rejects.toThrow('Request not found');
  });
});
