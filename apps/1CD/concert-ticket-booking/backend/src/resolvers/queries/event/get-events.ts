import { QueryResolvers } from '../../../generated';
import Event from '../../../models/event.model';
import { Event as EventType } from '../../../generated';
import { TZDate } from '@date-fns/tz';

export const getEvents: QueryResolvers['getEvents'] = async (_, { filter = {} }) => {
  const today = new Date().toISOString();
  const { q, date, artist } = filter;
  const findFilter: any = { $and: [{ scheduledDays: { $elemMatch: { $gte: today } } }] };

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
    const startDate = new TZDate(date, 'Asia/Ulaanbaatar');
    startDate.setHours(0);
    const startIsoDate = new TZDate(startDate, 'UTC').toISOString();

    const endDate = new TZDate(date, 'Asia/Ulaanbaatar');
    endDate.setHours(23);
    endDate.setMinutes(59);
    const endIsoDate = new TZDate(endDate, 'UTC').toISOString();

    findFilter.$and.push({
      scheduledDays: {
        $elemMatch: {
          $gte: startIsoDate,
          $lte: endIsoDate,
        },
      },
    });
  }

  if (artist) {
    findFilter.$and.push({
      $or: [{ mainArtists: { $elemMatch: { name: { $regex: new RegExp(artist, 'i') } } } }, { guestArtists: { $elemMatch: { name: { $regex: new RegExp(artist, 'i') } } } }],
    });
  }

  const events: EventType[] = await Event.find(findFilter).populate(['products', 'venue']);

  return events;
};
