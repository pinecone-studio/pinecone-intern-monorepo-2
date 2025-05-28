import { addHotel } from './mutations/add-hotel';
import { getAllHotels } from './queries/get-all-hotels';
import { createRoom } from './mutations/room/create-room';
import {getAllRooms} from './queries/room/get-all-rooms'
import { getRoomForId } from './queries/room/get-room-for-id';


export const resolvers = {
  Mutation: {
    addHotel,
    createRoom
  },
  Query: {
    getAllHotels,
    getAllRooms,
    getRoomForId
  },
};
