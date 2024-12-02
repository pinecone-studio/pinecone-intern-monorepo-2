import { QueryResolvers } from '../../../generated';
import Event from '../../../models/event.model';

export const getSpecialEvent: QueryResolvers['getSpecialEvent'] = async () => {
  const events = await Event.find({ priority: 'high' });
  return events;
};
