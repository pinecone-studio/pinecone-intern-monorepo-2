import { createBooking } from "./create-book";
import { updateBooking } from "./update-booking";
import { deleteBooking } from "./delete-booking";

export const bookingMutations = {
  createBooking,
  updateBooking,
  deleteBooking,
};

// Export individual functions for testing
export { createBooking, updateBooking, deleteBooking };