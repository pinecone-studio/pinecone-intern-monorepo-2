import { QueryResolvers } from '../../../generated';
import { Event as EventType } from '../../../generated';
import Event from '../../../models/event.model';

export const getRelatedEvents: QueryResolvers['getRelatedEvents'] = async (_, { eventId }) => {
  const today = new Date().toISOString();
  const eventDetail = await Event.findById(eventId).populate(['products', 'venue']);
  const categories = eventDetail.category; //array
  const relatedEvents: EventType[] = await Event.find({
    category: { $in: categories },
    _id: { $ne: eventId },
    scheduledDays: {
      $elemMatch: { $gte: today },
    },
  })
    .limit(6)
    .populate(['products', 'venue']);

  return { eventDetail, relatedEvents };
};
