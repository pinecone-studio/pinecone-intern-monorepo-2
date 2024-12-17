import { QueryResolvers } from '../../../generated';
import Event from '../../../models/event.model';
import { Event as EventType } from '../../../generated';

export const getEvents: QueryResolvers['getEvents'] = async (_, { filter = {} }) => {
  const today = new Date().toISOString();
  const { q, date, artist } = filter;
  const findFilter: any = { $and: [{ scheduledDays: { $elemMatch: { $gte: today } } }] };
  const dateSplitted = date?.split('T')[0];

  if (q) {
    findFilter.$and.push({
      $or: [
        {
          name: { $regex: new RegExp(q, 'i') },
        },
        {
          description: { $regex: new RegExp(q, 'i') },
        },
      ],
    });
  }

  if (date) {
    const startDate = dateSplitted + 'T00:00';
    const endDate = dateSplitted + 'T23:59';
    findFilter.$and.push({ scheduledDays: { $elemMatch: { $gte: startDate, $lte: endDate } } });
  }

  if (artist) {
    findFilter.$and.push({ $or: [{ mainArtists: { $elemMatch: { $regex: new RegExp(artist, 'i') } } }, { guestArtists: { $elemMatch: { $regex: new RegExp(artist, 'i') } } }] });
  }

  const events: EventType[] = await Event.find(findFilter).populate(['products', 'venue']);

  return events;
};
