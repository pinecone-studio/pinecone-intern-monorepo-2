import { GraphQLResolveInfo } from 'graphql';
import { concertModel } from 'src/models';
import { getConcertById } from 'src/resolvers/queries/concert/get-concert-by-id';
import { getConcertByIdSchema } from 'src/zodSchemas';

jest.mock('src/models', () => ({
  concertModel: {
    findById: jest.fn(),
  },
}));

const mockConcert = {
  _id: 'abc123',
  title: 'Mock Concert',
  artists: [{ name: 'Uka' }],
  ticket: [{ ticketType: 'VIP' }],
  schedule: [{ startDate: '2025-08-01' }],
};

describe('getConcertById', () => {
  it('throws a validation error if concertId is empty', () => {
    expect(() => getConcertByIdSchema.parse({ concertId: '' })).toThrowError('Id is required');
  });

  it('throws error if concert not found', async () => {
    // Mock 3 populate calls chaining and ending with null
    const thirdPopulate = jest.fn().mockResolvedValue(null);
    const secondPopulate = jest.fn(() => ({ populate: thirdPopulate }));
    const firstPopulate = jest.fn(() => ({ populate: secondPopulate }));

    (concertModel.findById as jest.Mock).mockReturnValue({ populate: firstPopulate });

    await expect(getConcertById!({}, { input: { concertId: 'missing-id' } }, {}, {} as GraphQLResolveInfo)).resolves.toBeNull();
  });

  it('returns concert if found', async () => {
    const thirdPopulate = jest.fn().mockResolvedValue(mockConcert);
    const secondPopulate = jest.fn(() => ({ populate: thirdPopulate }));
    const firstPopulate = jest.fn(() => ({ populate: secondPopulate }));

    (concertModel.findById as jest.Mock).mockReturnValue({ populate: firstPopulate });

    const result = await getConcertById!({}, { input: { concertId: 'abc123' } }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual(mockConcert);
  });

  it('should throw new error with original error message when findById throws', async () => {
    const originalError = new Error('Database connection failed');

    // Mock findById to throw an error (simulate DB error)
    (concertModel.findById as jest.Mock).mockImplementation(() => {
      throw originalError;
    });

    await expect(getConcertById!({}, { input: { concertId: 'some-id' } }, {}, {} as any)).rejects.toThrow('Database connection failed');
  });

  it('should throw default error message if thrown error is not an Error instance', async () => {
    // Mock findById to throw a non-Error (e.g. a string)
    (concertModel.findById as jest.Mock).mockImplementation(() => {
      throw 'Some string error';
    });

    await expect(getConcertById!({}, { input: { concertId: 'some-id' } }, {}, {} as any)).rejects.toThrow('Concert fetch failed');
  });
});
