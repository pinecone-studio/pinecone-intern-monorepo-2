import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';

export const updateEventHigh: MutationResolvers['updateEventHigh'] = async (_, { eventId }) => {
  const updatedEventPriority = await Event.findByIdAndUpdate({ eventId }, { priority: 'high' }, { new: true });
  if (!updatedEventPriority) {
    throw new Error('Event not found');
  }
  return { message: 'success' };
};
