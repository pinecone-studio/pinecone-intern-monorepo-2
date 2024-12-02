import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';
import User from '../../../models/user.model';

export const deleteEvent: MutationResolvers['deleteEvent'] = async (_, { _id }, { userId }) => {
  const user = await User.findById({ userId });
  if (!user) {
    throw new Error('Unauthorized');
  }
  const eventDeleted = await Event.findOneAndDelete({ _id });
  if (!eventDeleted) {
    throw new Error('Event not found');
  }
  return eventDeleted;
};
