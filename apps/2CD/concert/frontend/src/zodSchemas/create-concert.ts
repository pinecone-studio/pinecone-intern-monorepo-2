import { TicketType } from '@/generated';
import z from 'zod';

export const ticketSchema = z.object({
  price: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Price must be a positive number',
    }),
  quantity: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Quantity must be a positive number',
    }),
  type: z.enum([TicketType.Backseat, TicketType.Vip, TicketType.Standard]),
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
 export type ConcertInput = z.infer<typeof concertSchema>