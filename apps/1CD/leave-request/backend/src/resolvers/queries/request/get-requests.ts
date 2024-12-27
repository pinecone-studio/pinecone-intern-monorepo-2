import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';

export const getAllRequestsBySupervisor: QueryResolvers['getAllRequestsBySupervisor'] = async (_, { supervisorEmail }) => {
  const results = await RequestModel.aggregate([
    {
      $match: { supervisorEmail },
    },
    {
      $lookup: {
        from: 'users', // The name of the collection to join (lowercase and plural by default)
        localField: 'email', // Field in the `Requests` collection
        foreignField: 'email', // Field in the `Users` collection
        as: 'email', // The output array field for the joined data
      },
    },
    {
      $unwind: '$email', // Flatten the joined data (optional, if you want a single object per document)
    },
  ]);

  // console.log(bag)
  return results;
};
