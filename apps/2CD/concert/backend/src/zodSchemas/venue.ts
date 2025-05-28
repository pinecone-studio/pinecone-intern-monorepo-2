import z from 'zod';

export const venueZod = z.object({
  city: z.string(),
  address: z.string(),
  name: z.string(),
  capacity: z.number(),
});
