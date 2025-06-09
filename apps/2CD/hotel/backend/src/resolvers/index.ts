import { CreateBooking } from './mutations/booking/create-booking';
import { updateBooking } from './mutations/booking/update-booking';
import { addHotel } from './mutations/hotel/add-hotel';
import { getAllHotels } from './queries/hotel/get-all-hotels';
import { createRoom } from './mutations/room/create-room';
import { getHotelById } from './queries/hotel/get-hotel-by-id';
import { getAllRooms } from './queries/room/get-all-rooms';
import { getRoomForId } from './queries/room/get-room-for-id';
import { updateRoom } from './mutations/room/update-room';
import { deleteRoom } from './mutations/room/delete-room';
import reviewMutations from './mutations/review-mutations';
import { updateHotel } from './mutations/hotel/update-hotel';
import { getAllBookings } from './queries/booking/get-all-booking';
import { getBookingById } from './queries/booking/get-booking-by-id';
import { updateUserRoleToAdmin } from './mutations/update-user-role-to-admin';
import { getAllUsers } from './queries/user/get-all-user';
import { getUserById } from './queries/user/get-user-by-id';
import { reviewQueries } from './queries/review-query';
import { mostReviewedHotels } from './queries/most-reviewed-hotel';
import { mostBookedHotel } from './queries/booking/most-booked-hotel';

export const resolvers = {
  Mutation: {
    addHotel,
    updateHotel,
    CreateBooking,
    updateBooking,
    createRoom,
    updateRoom,
    deleteRoom,
    ...reviewMutations,
    updateUserRoleToAdmin,
  },
  Query: {
    getAllHotels,
    getHotelById,
    getAllRooms,
    getRoomForId,
    getAllBookings,
    getBookingById,
    getAllUsers,
    getUserById,
    ...reviewQueries,
    mostReviewedHotels,
    mostBookedHotel,
  },
};
