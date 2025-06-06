import { QueryResolvers } from 'src/generated';
import { concertModel } from 'src/models';

export const getFeaturedConcerts: QueryResolvers['getFeaturedConcerts'] = async () => {
  const concerts = await concertModel.aggregate([
    {
      $match: {
        featured: true,
      },
    },
    {
      $lookup: {
        from: 'artists',
        localField: 'artists',
        foreignField: '_id',
        as: 'artists',
      },
    },
    {
      $lookup: {
        from: 'schedules',
        localField: 'schedule',
        foreignField: '_id',
        as: 'schedule',
      },
    },
  ]);

  return concerts;
};
