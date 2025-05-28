import { getUserById } from './queries/get-user-by-id';
import { addHotel } from './mutations/add-hotel';
import { getAllHotels } from './queries/get-all-hotels';
import { createRoom } from './mutations/room/create-room';

export const resolvers = {
  Mutation: {
    addHotel,
    createRoom
  },
  Query: {
    getAllUsers,
    sampleQuery: () => 'This is a sample query',
    getUserById, 
    getAllHotels,
  },
  Mutation: {
    createUser,
    sampleMutation: () => 'This is a sample mutation',
    addHotel,
  },
};
