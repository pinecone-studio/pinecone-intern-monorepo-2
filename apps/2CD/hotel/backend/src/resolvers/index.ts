import { CreateBooking } from './mutations/booking/create-booking';
import { updateBooking } from './mutations/booking/update-booking';
import { addHotel } from './mutations/hotel/add-hotel';
import { getAllHotels } from './queries/hotel/get-all-hotels';
import { createRoom } from './mutations/room/create-room';
import { getHotelById } from './queries/hotel/get-hotel-by-id';
import {getAllRooms} from './queries/room/get-all-rooms'
import { getRoomForId } from './queries/room/get-room-for-id';
import {updateRoom} from './mutations/room/update-room'
import { deleteRoom } from './mutations/room/delete-room';
import reviewMutations from './mutations/review-mutations';
import { getAllBookings } from './queries/booking/get-all-booking';
import { getBookingById } from './queries/booking/get-booking-by-id';
import { createUser } from './mutations/create-user';
import { updateUserRoleToAdmin } from './mutations/update-user-role-to-admin';

export const resolvers = {
  Mutation: {
    addHotel,
    CreateBooking,
    updateBooking,
    createRoom,
    updateRoom,
    deleteRoom,
    ...reviewMutations,
    createUser,
    updateUserRoleToAdmin
  },
  Query: {
    getAllHotels,
    getHotelById,
    getAllRooms,
    getRoomForId,
    getAllBookings,
    getBookingById,
  },
};