import { bookingMutations } from './booking';

export const mutations = {
  ...bookingMutations,
};

// Export individual functions for testing
export { createBooking, updateBooking, deleteBooking } from './booking';