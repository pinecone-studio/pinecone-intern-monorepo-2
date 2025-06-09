import { z } from 'zod';

export const bookingSchema = z.object({
  _id: z.string(),
  user: z.string(), 
  concert: z.object({
    _id: z.string(),
    title: z.string(),
    date: z.string(), 
    artists: z.array(
      z.object({
        _id: z.string(),
        name: z.string(),
      })
    ),
    venue: z.object({
      _id: z.string(),
      name: z.string(),
      location: z.string(),
    }),
  }),
  ticket: z.object({
    _id: z.string(),
    type: z.string(),
    price: z.number(),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
