import { MutationResolvers } from 'src/generated';
import { venueModel } from 'src/models';
const validateVenueInput = (input: { name?: string; capacity?: number }) => {
  const { name, capacity } = input;
  if (!name || !capacity) {
    throw new Error('missing required input fields');
  }
};
export const createVenue: MutationResolvers['createVenue'] = async (_, { input }) => {
  validateVenueInput(input);
  const newVenue = await venueModel.create(input);
  return newVenue;
};