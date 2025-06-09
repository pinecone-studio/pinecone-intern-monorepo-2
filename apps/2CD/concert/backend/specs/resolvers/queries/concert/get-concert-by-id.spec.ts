import { GraphQLResolveInfo } from 'graphql';
import { concertModel } from 'src/models';
import { getConcertById } from 'src/resolvers/queries/concert/get-concert-by-id';
import { getConcertByIdSchema } from 'src/zodSchemas';

jest.mock('src/models', () => ({
  concertModel: {
    findById: jest.fn(() => ({
      populate: jest.fn().mockReturnThis(),
    })),
  },
}));
describe('getConcertById', () => {
  it('should throw error if concertId empty', () => {
    expect(() => getConcertByIdSchema.parse({ concertId: '' })).toThrowError('Id is required');
  });
  it('should throw error if concert not exist ', async () => {
    (concertModel.findById as jest.Mock).mockResolvedValueOnce(null);
    const result = await getConcertById!({}, { input: { concertId: 'asdf' } }, {}, {} as GraphQLResolveInfo);
    console.log(result, 'ytf');

    expect(result).toContain({ success: false });
  });
});
