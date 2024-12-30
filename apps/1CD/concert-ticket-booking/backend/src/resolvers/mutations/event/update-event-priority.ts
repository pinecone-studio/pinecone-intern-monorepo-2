import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';

export const updateEventPriority: MutationResolvers['updateEventPriority'] = async (_, { input, _id }) => {
  try{const { priority } = input;
  const updatedEventPriority = await Event.findByIdAndUpdate({ _id }, { priority, updatedDate: new Date() }, { new: true });
  if (!updatedEventPriority) {
    throw new Error('Event not found');
  }
  return updatedEventPriority;}catch(error) {
    throw new Error('Failed to update priority')
  }
};
