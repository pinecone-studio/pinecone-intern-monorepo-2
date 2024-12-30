import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';

export const updateEventLow: MutationResolvers['updateEventLow'] = async (_, { eventId }) => {
  const updatedEventPriority = await Event.findByIdAndUpdate({ eventId }, { priority: 'low' }, { new: true });
  if (!updatedEventPriority) {
    throw new Error('Event not found');
  }
  return { message: 'success' };
};
