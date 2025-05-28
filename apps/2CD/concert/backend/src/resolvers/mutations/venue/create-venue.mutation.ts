import { MutationResolvers } from 'src/generated';
import { venueModel } from 'src/models';
import z from 'zod';
const venueSchema = z.object({
  name: z.string().min(1, 'venue name is required'),
  capacity: z.number().min(1, 'venue capacity is required'),
  city: z.string().min(1, 'venue city is required'),
  address: z.string().min(1, 'venue address is required'),
});

export const createVenue: MutationResolvers['createVenue'] = async (_, { input }) => {
  const values = venueSchema.parse(input);
  const venue = await venueModel.findOne({
    name: values.name,
  });
  if (venue) {
    throw new Error('venue name is exist');
  }
  const newVenue = await venueModel.create(input);
  return newVenue;
};

