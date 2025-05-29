import { addHotel } from './mutations/add-hotel';
import { CreateBooking } from './mutations/booking/create-booking';
import { updateBooking } from './mutations/booking/update-booking';
import { getAllHotels } from './queries/get-all-hotels';
import { createRoom } from './mutations/room/create-room';
import {getAllRooms} from './queries/room/get-all-rooms'
import { getRoomForId } from './queries/room/get-room-for-id';
import { createUser } from './mutations/create-user';
import { updateUserRoleToAdmin } from './mutations/update-user-role-to-admin';


export const resolvers = {
  Mutation: {
    addHotel,
    CreateBooking,
    updateBooking,
    createRoom,
    createUser,
    updateUserRoleToAdmin
  },
  Query: {
    getAllHotels,
    getAllRooms,
    getRoomForId
  },
};