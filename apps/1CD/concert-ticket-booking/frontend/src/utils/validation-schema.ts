import { z } from 'zod';

const TicketTypeInputSchema = z.object({
  zoneName: z.string().min(1, { message: 'Zone name is required.' }),
  totalQuantity: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
    message: 'Талбарыг  бөглөнө үү',
  }),
  unitPrice: z.string().refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
    message: 'Талбарыг бөглөнө үү',
  }),
  discount: z
    .string({
      message: 'Талбарыг бөглөнө үү',
    })
    .optional(),
  additional: z.string().optional(),
});

export { EventInputSchema, TicketTypeInputSchema };

const EventInputSchema = z.object({
  name: z.string().min(1, { message: 'Event name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  image: z.string().min(1, { message: 'Image URL is required.' }),
  mainArtists: z
    .array(
      z.object({
        name: z.string().min(1, 'Артистын нэр оруулах шаардлагатай'),
      })
    )
    .min(1, 'Үндсэн артистууд оруулах шаардлагатай'),
  guestArtists: z
    .array(
      z
        .object({
          name: z.string({ message: ' Артистын нэр оруулах шаардлагатай' }),
        })
        .required()
    )
    .optional(),
  venue: z.string().min(1, { message: 'Байршил сонгоно уу' }),
  category: z.array(z.string()).min(1, { message: 'At least one category is required.' }),
  dateRange: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .refine((data) => (data.from && data.to ? data.from <= data.to : true), {
      message: 'Start date must be before or equal to end date',
    }),
  time: z.object({
    hour: z
      .string()
      .min(1, 'Hour is required')
      .regex(/^(0[0-9]|1[0-9]|2[0-4])$/, 'Invalid hour format. Use 00-24'),
    minute: z
      .string()
      .min(1, 'Minute is required')
      .regex(/^(0[0-9]|[1-5][0-9])$/, 'Invalid minute format. Use 00-59'),
  }),
  ticketType: z.array(TicketTypeInputSchema).min(1, { message: 'At least one ticket type is required.' }),
});

export type EventInputType = z.infer<typeof EventInputSchema>;
