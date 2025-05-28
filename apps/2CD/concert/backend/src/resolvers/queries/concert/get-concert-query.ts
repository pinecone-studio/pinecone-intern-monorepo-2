/* eslint-disable @typescript-eslint/no-explicit-any*/
import { QueryResolvers } from 'src/generated';
import { concertModel } from 'src/models';
import { buildConcertFilter, buildScheduleMatch, convertIdFields } from 'src/utils/converid-fields';

export const getConcert: QueryResolvers['getConcert'] = async (_, { input }) => {
  const filter = buildConcertFilter(input);
  const match = buildScheduleMatch(input?.date);
  const data = await concertModel.find(filter).populate('artists').populate('ticket').populate('venue').populate({ path: 'schedule', match }).lean();
 const filtered = data.filter((concert) => Array.isArray(concert.schedule) && concert.schedule.length > 0);
  return convertIdFields(filtered);
};
