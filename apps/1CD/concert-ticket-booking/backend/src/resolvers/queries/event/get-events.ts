import { QueryResolvers } from '../../../generated';
import Event from '../../../models/event.model';

export const getEvents: QueryResolvers['getEvents'] = async (_, { filter = {} }) => {
  // const { q, date, categoryId } = filter;
  const { q } = filter;
  const findFilter: any = {};

  if (q) {
    findFilter.$or = [
      {
        name: { $regex: new RegExp(q, 'i') },
      },
      {
        description: { $regex: new RegExp(q, 'i') },
      },
    ];
  }

  // if (date) {
  //   // findFilter
  // }

  // if (categoryId) {
  //   findFilter.categoryId = categoryId;
  // }

  const events = await Event.find(findFilter);

  return events;
};
