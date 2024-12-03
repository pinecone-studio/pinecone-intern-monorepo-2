import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';

export const updateEvent: MutationResolvers['updateEvent'] = async (_, { _id, event }) => {
  const eventUpdated = await Event.findOneAndUpdate({ _id }, { $set: event }, { new: true });
  return eventUpdated;
};
