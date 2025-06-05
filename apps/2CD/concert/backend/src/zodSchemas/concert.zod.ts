import z from 'zod';

export const ticketSchema = z.object({
  price: z.number().positive('Price must be a positive number'),
  quantity: z.number().positive('Quantity must be a positive number'),
  type: z.enum(['VIP', 'STANDARD', 'BACKSEAT']),
});

export const schedule = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: 'startDate must be before endDate',
    path: ['endDate'],
  });
export const concertSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  venueId: z.string().min(1, 'Venue ID cannot be empty'),
  thumbnailUrl: z.string().url('Thumbnail URL must be a valid URL'),
  artists: z.array(z.string()).min(1, 'At least one artist is required'),
  ticket: z.array(ticketSchema).min(1, 'At least one ticket option is required'),
  schedule: z.array(schedule).min(1, 'At least one schedule entry is required'),
});
export const updateConcertSchema = z.object({
  id: z.string().min(1, 'Id is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  venueId: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  artists: z.array(z.string()).optional(),
  ticket: z.array(ticketSchema).optional(),
  schedule: z.array(schedule).optional(),
  featured: z.boolean().optional(),
});
