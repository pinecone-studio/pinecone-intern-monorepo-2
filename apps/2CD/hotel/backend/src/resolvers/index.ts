import { addHotel } from './mutations/add-hotel';
import { getAllHotels } from './queries/get-all-hotels';

export const resolvers = {
  Mutation: {
    addHotel,
  },
  Query: {
    getAllHotels,
  },
};
