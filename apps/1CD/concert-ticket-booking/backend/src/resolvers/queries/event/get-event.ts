import { QueryResolvers } from '../../../generated';
import Event from '../../../models/event.model';

export const getEventById: QueryResolvers['getEventById'] = async (_, { _id }) => {
  const event = await Event.findById(_id).populate(['products', 'venue']);
  if (!event) {
    throw new Error('Event not found');
  }
  return event;
};
