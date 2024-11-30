import { QueryResolvers } from '../../../generated';

import Event from '../../../models/event.model';

export const getRelatedEvents: QueryResolvers['getRelatedEvents'] = async (_, { eventId }) => {
  const today = new Date().toISOString();
  const eventDetail = await Event.findById(eventId);
  if (!eventDetail) {
    throw new Error('Event not found');
  }
  const categories = eventDetail.category; //array
  const relatedEvents = await Event.find({
    category: { $in: categories },
    _id: { $ne: eventId },
    scheduledDays: {
      $elemMatch: { $gte: today },
    },
  }).limit(6);

  return { eventDetail, relatedEvents };
};
