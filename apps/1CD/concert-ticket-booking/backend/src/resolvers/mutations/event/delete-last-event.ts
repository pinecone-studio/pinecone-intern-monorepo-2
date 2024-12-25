import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';

export const deleteLastEvent: MutationResolvers['deleteLastEvent'] = async () => {
  const lastEvent = await Event.findOne().sort({ createdAt: -1 });

  if (!lastEvent) {
    throw new Error('No events found');
  }
  await Event.deleteOne({ _id: lastEvent._id });

  return { message: 'Event successfully deleted' };
};
