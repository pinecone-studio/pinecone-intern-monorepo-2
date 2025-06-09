import z from 'zod';

export const bookedTicketSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID can not be empty'),
  quantity: z.number().positive('Quantity must be a positive number'),
});

export const bookingSchema = z.object({
    userId: z.string().min(1, 'User ID can not be empty'),
    concertId: z.string().min(1, 'Concert ID can not be empty'),
    tickets: z.array(bookedTicketSchema).min(1, 'At least one ticket option is required'),
})