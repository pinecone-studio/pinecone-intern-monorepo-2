import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';

export const updateEventPriority: MutationResolvers['updateEventPriority'] = async (_, { input, _id }) => {
  const { priority } = input;
  const updatedEvent = await Event.findByIdAndUpdate({ _id }, { priority });
  if (!updatedEvent) {
    throw new Error('Event not found');
  }
  return updatedEvent;
};
