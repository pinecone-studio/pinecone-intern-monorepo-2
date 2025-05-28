import { createUser } from './mutations/create-user';
import { getAllUsers } from './queries/get-all-user';
import { getUserById } from './queries/get-user-by-id';

export const resolvers = {
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
