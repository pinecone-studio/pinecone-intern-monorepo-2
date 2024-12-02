import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';

export const deleteEvent: MutationResolvers['deleteEvent'] = async (_, { _id }) => {
  console.log({ _id });
  try {
    const eventDeleted = await Event.findOneAndDelete({ _id });
    console.log({ eventDeleted });
    if (!eventDeleted) {
      throw new Error('Event not found');
    }
    console.log('delete', eventDeleted);
    return {
      message: 'success',
    };
  } catch (e) {
    console.log({ e });
    return {
      message: 'error',
    };
  }
};
