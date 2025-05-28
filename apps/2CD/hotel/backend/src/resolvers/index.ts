import { addHotel } from './mutations/add-hotel';
import { CreateBooking } from './mutations/booking/create-booking';
import { updateBooking } from './mutations/booking/update-booking';
import { getAllHotels } from './queries/get-all-hotels';

export const resolvers = {
  Mutation: {
    addHotel,
    CreateBooking,
    updateBooking
  },
  Query: {
    getAllHotels,
  },
};
