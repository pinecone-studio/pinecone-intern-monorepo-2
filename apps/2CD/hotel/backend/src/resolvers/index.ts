import { addHotel } from './mutations/add-hotel';
import { getAllHotels } from './queries/get-all-hotels';
import reviewMutations from './mutations/review-mutations';

export const resolvers = {
  Mutation: {
    addHotel,
    ...reviewMutations,
  },
  Query: {
    getAllHotels,
  },
};
