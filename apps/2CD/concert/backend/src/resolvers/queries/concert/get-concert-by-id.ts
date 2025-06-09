import { QueryResolvers } from 'src/generated';
import { concertModel } from 'src/models';
import { getConcertByIdSchema } from 'src/zodSchemas';

export const getConcertById: QueryResolvers['getConcertById'] = async (_, { input }) => {
  const values = getConcertByIdSchema.parse(input);
  try {
    const concert = await concertModel.findById(values.concertId).populate('artists').populate('ticket').populate('schedule');

    return concert;
  } catch (error) {
    throw {
      success: false,
      error: error,
    };
  }
};
