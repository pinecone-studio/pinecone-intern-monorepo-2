/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { concertModel } from 'src/models';
import { updateConcert } from 'src/resolvers/mutations/concert';
import { updateConcertSchema } from 'src/zodSchemas';
import { Response } from 'src/generated';

jest.mock('src/models', () => ({
  concertModel: {
    findByIdAndUpdate: jest.fn(),
  },
}));
describe('update concert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should throw error if concert not found', async () => {
    (concertModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);
    await expect(updateConcert!({}, { input: { id: '123' } }, {}, {} as GraphQLResolveInfo)).rejects.toThrowError('Concert not found');
  });

  it('should throw error id required', () => {
    expect(() => updateConcertSchema.parse({ id: '' })).toThrowError('Id is required');
  });
  it('if successfully update', async () => {
    (concertModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({ id: '123', featured: true });
    const result = await updateConcert!({}, { input: { id: '123', featured: true } }, {}, {} as GraphQLResolveInfo);
    expect(concertModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(result).toBe(Response.Success);
  });
});
