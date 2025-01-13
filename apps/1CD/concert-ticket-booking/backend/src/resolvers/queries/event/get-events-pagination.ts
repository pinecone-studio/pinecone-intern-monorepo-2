import { QueryResolvers } from '../../../generated';
import Event from '../../../models/event.model';
import { Event as EventType } from '../../../generated';

export const getEventsPaged: QueryResolvers['getEventsPaged'] = async (_, { filter = {} }) => {
  const today = new Date().toISOString();
  const { q, date, artist, page } = filter;
  const findFilter: any = {
    $and: [{ scheduledDays: { $elemMatch: { $gte: today } } }, { isArchived: false }],
  };

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
    const startIsoDate = date;
    const startDate = new Date(startIsoDate);
    startDate.setHours(23);
    startDate.setMinutes(59);
    const endIsoDate = startDate.toISOString();

    findFilter.$and.push({
      scheduledDays: {
        $elemMatch: {
          $gte: startIsoDate,
          $lte: endIsoDate,
        },
      },
    });
  }

  const size = 10;

  if (artist) {
    findFilter.$and.push({
      $or: [{ mainArtists: { $elemMatch: { name: { $regex: new RegExp(artist, 'i') } } } }, { guestArtists: { $elemMatch: { name: { $regex: new RegExp(artist, 'i') } } } }],
    });
  }

  const events: EventType[] = await Event.find(findFilter)
    .sort({ createdAt: -1 })
    .limit(size)
    .skip((Number(page) - 1) * size)
    .populate(['products', 'venue']);

  const count = await Event.countDocuments(findFilter);
  const totalPages = Math.ceil(count / size);

  return { events, totalPages };
};
