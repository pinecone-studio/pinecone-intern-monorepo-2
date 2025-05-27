/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { RequestModel } from 'src/models';
import { getAllRequists } from 'src/resolvers/queries/index';
jest.mock('src/models', () => ({
  RequestModel: {
    find: jest.fn(),
    insertMany: jest.fn(),
  },
}));
describe('sampleQuery', () => {
  const mockData = [
    { status: 'PENDING', name: 'test' },
    { status: 'PENDING', name: 'test1' },
    { status: 'DONE', name: 'test1' },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return all requists', async () => {
    (RequestModel.find as jest.Mock).mockResolvedValue(mockData);
    (RequestModel.insertMany as jest.Mock).mockResolvedValue(mockData);

    const result = await getAllRequists!({}, {}, {}, {} as GraphQLResolveInfo);
    expect(RequestModel.find).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });
});
