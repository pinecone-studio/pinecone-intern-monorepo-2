import { addHotel } from './mutations/add-hotel';
import { getAllHotels } from './queries/get-all-hotels';
import { createRoom } from './mutations/room/create-room';

export const resolvers = {
  Mutation: {
    addHotel,
    createRoom
  },
  Query: {
    getAllHotels,
  },
};
