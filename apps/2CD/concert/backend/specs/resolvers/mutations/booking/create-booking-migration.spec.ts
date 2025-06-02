// import { GraphQLResolveInfo } from 'graphql';
// import { createBooking } from 'src/resolvers/mutations/booking';
// import { catchError } from 'src/utils/catch-error';
// import { bookingsModel } from 'src/models';
// import { validateConcert } from 'src/utils/create-booking-validation.ts/validate-concert';
// import { validateTickets } from 'src/utils/create-booking-validation.ts/validate-tickets';
// import { validateUser } from 'src/utils/create-booking-validation.ts/validate-user';

// jest.mock('../../../src/utils/create-booking/validate-user', () => ({
//   validateUser: jest.fn().mockResolvedValue(true),
// }));

// jest.mock('../../../src/utils/create-booking/validate-concert', () => ({
//   validateConcert: jest.fn().mockResolvedValue(true),
// }));

// jest.mock('../../../src/utils/create-booking/validate-tickets', () => ({
//   validateTickets: jest.fn().mockResolvedValue(true),
// }));

// jest.mock('../../../src/models/booking.model', () => ({
//   bookingsModel: {
//     create: jest.fn().mockResolvedValue({
//       id: 'booking_test_id',
//       user: 'testing_user',
//       concert: 'concert_test',
//       tickets: ['ticket_test'],
//       totalAmount: 169,
//       status: 'PENDING',
//     }),
//     findById: jest.fn().mockReturnValue({
//       populate: jest.fn().mockReturnThis(),
//       exec: jest.fn().mockResolvedValue({
//         id: 'booking_test_id',
//         user: { id: 'testing_user' },
//         concert: { id: 'concert_test' },
//         tickets: [{ id: 'ticket_test' }],
//         totalAmount: 169,
//         status: 'PENDING',
//       }),
//     }),
//   },
// }));

// jest.mock('../../../src/utils/catch-error', () => ({
//   catchError: jest.fn((error) => {
//     if (error instanceof Error) {
//       throw new Error(error.message);
//     }
//     throw new Error('Серверийн алдаа');
//   }),
// }));
// const info = {} as GraphQLResolveInfo;

// const args = {
//   input: {
//     userId: 'userId_test',
//     concertId: 'concert_test',
//   },
//   ticketIds: ['ticket_test'],
// };

// describe('createBooking Mutation', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should create a booking successfully', async () => {
//     const response = await createBooking({}, args, {}, info);
//     expect(response?.concert.id).toBe(args.input.concertId);
//     expect(response?.id).toBe('booking_test_id');
//     expect(response?.status).toBe('PENDING');
//     expect(catchError).not.toHaveBeenCalled();
//   });

//   it('should throw "Серверийн алдаа" when non-Error is encountered', async () => {
//     const nonError = 'Unexpected error';
//     jest.spyOn(validateUser, 'validateUser').mockRejectedValueOnce(nonError);

//     await expect(createBooking({}, args, context, info)).rejects.toThrow('Серверийн алдаа');
//     expect(catchError).toHaveBeenCalledWith(nonError);
//     expect(catchError).toHaveBeenCalledTimes(1);
//   });

//   it('should handle Error when booking creation fails', async () => {
//     const error = new Error('Booking creation failed');
//     jest.spyOn(bookingsModel.bookingsModel, 'create').mockRejectedValueOnce(error);

//     await expect(createBooking({}, args, context, info)).rejects.toThrow('Booking creation failed');
//     expect(catchError).toHaveBeenCalledWith(error);
//     expect(catchError).toHaveBeenCalledTimes(1);
//   });

//   it('should throw "Серверийн алдаа" when non-Error is encountered in booking creation', async () => {
//     const nonError = { message: 'Unexpected error object' };
//     jest.spyOn(bookingsModel.bookingsModel, 'create').mockRejectedValueOnce(nonError);

//     await expect(createBooking({}, args, context, info)).rejects.toThrow('Серверийн алдаа');
//     expect(catchError).toHaveBeenCalledWith(nonError);
//     expect(catchError).toHaveBeenCalledTimes(1);
//   });

//   // Edge case testing: Handle invalid user ID
//   it('should handle invalid user ID', async () => {
//     const error = new Error('User validation failed');
//     jest.spyOn(validateUser, 'validateUser').mockRejectedValueOnce(error);

//     await expect(createBooking({}, { input: { userId: 'invalid_user', concertId: 'concert_test' }, ticketIds: [] }, context, info))
//       .rejects.toThrow('User validation failed');
//     expect(catchError).toHaveBeenCalledWith(error);
//     expect(catchError).toHaveBeenCalledTimes(1);
//   });

//   // Edge case testing: Handle invalid concert ID
//   it('should handle invalid concert ID', async () => {
//     const error = new Error('Concert validation failed');
//     jest.spyOn(validateConcert, 'validateConcert').mockRejectedValueOnce(error);

//     await expect(createBooking({}, { input: { userId: 'valid_user', concertId: 'invalid_concert' }, ticketIds: [] }, context, info))
//       .rejects.toThrow('Concert validation failed');
//     expect(catchError).toHaveBeenCalledWith(error);
//     expect(catchError).toHaveBeenCalledTimes(1);
//   });

//   // Edge case testing: Handle invalid ticket IDs
//   it('should handle invalid ticket IDs', async () => {
//     const error = new Error('Tickets validation failed');
//     jest.spyOn(validateTickets, 'validateTickets').mockRejectedValueOnce(error);

//     await expect(createBooking({}, { input: { userId: 'valid_user', concertId: 'concert_test' }, ticketIds: ['invalid_ticket'] }, context, info))
//       .rejects.toThrow('Tickets validation failed');
//     expect(catchError).toHaveBeenCalledWith(error);
//     expect(catchError).toHaveBeenCalledTimes(1);
//   });

//   // Edge case testing: Empty ticket IDs
//   it('should handle empty ticket IDs', async () => {
//     const error = new Error('Tickets validation failed');
//     jest.spyOn(validateTickets, 'validateTickets').mockRejectedValueOnce(error);

//     await expect(createBooking({}, { input: { userId: 'valid_user', concertId: 'concert_test' }, ticketIds: [] }, context, info))
//       .rejects.toThrow('Tickets validation failed');
//     expect(catchError).toHaveBeenCalledWith(error);
//     expect(catchError).toHaveBeenCalledTimes(1);
//   });
// });
