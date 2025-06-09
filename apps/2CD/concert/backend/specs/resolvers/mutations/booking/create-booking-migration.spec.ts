/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { Response } from 'src/generated';
import { bookingsModel, concertModel, ticketModel, userModel } from 'src/models';
import { createBooking } from 'src/resolvers/mutations';
import { calculateTotalAmount } from 'src/utils/create-booking.ts/calculate-total-amount';
import * as DecreaseUtils from 'src/utils/create-booking.ts/decrease-ticket-quantity';
import { validateConcert } from 'src/utils/create-booking.ts/validate-concert';
import { validateUser } from 'src/utils/create-booking.ts/validate-user';
import { bookingSchema } from 'src/zodSchemas/booking.zod';
import * as validateUserModule from 'src/utils/create-booking.ts/validate-user';
import * as validateConcertModule from 'src/utils/create-booking.ts/validate-concert';

jest.mock('src/utils/create-booking.ts/validate-user', () => ({
  validateUser: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('src/utils/create-booking.ts/validate-concert', () => ({
  validateConcert: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('src/utils/create-booking.ts/calculate-total-amount', () => ({
  calculateTotalAmount: jest.fn().mockResolvedValue(150),
}));

jest.mock('src/utils/create-booking.ts/decrease-ticket-quantity', () => ({
  decrementTicketStock: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('src/models', () => ({
  bookingsModel: {
    create: jest.fn(),
  },
  userModel: {
    findById: jest.fn(),
  },
  concertModel: {
    findById: jest.fn(),
  },
  ticketModel: {
    findById: jest.fn(),
  },
}));

const mockInput = {
  userId: '507f191e810c19729de860ea',
  concertId: '507f191e810c19729de860eb',
  tickets: [
    { ticketId: '507f191e810c19729de860ec', quantity: 2 },
    { ticketId: '507f191e810c19729de860ed', quantity: 1 },
  ],
};

describe('createBooking Mutation', () => {
  const mockInfo = {} as GraphQLResolveInfo;

  beforeEach(() => {
    jest.clearAllMocks();
    (validateConcert as jest.Mock).mockResolvedValue(undefined);
    (validateUser as jest.Mock).mockResolvedValue(undefined);
  });

  it('should pass validation for valid input', () => {
    expect(() => bookingSchema.parse(mockInput)).not.toThrow();
  });

  it('should throw error if userId is empty', () => {
    const input = { ...mockInput, userId: '' };
    expect(() => bookingSchema.parse(input)).toThrow('User ID can not be empty');
  });

  it('should throw error if concertId is empty', () => {
    const input = { ...mockInput, concertId: '' };
    expect(() => bookingSchema.parse(input)).toThrow('Concert ID can not be empty');
  });

  it('should fail when a ticketId is empty', () => {
    const mock = {
      ...mockInput,
      tickets: [{ ...mockInput.tickets[0], ticketId: '' }, mockInput.tickets[1]],
    };
    expect(() => bookingSchema.parse(mock)).toThrow('Ticket ID can not be empty');
  });

  it('should fail when quantity is zero', () => {
    const mock = {
      ...mockInput,
      tickets: [{ ...mockInput.tickets[0], quantity: 0 }, mockInput.tickets[1]],
    };
    expect(() => bookingSchema.parse(mock)).toThrow('Quantity must be a positive number');
  });

  it('should fail when quantity is negative', () => {
    const mock = {
      ...mockInput,
      tickets: [{ ...mockInput.tickets[0], quantity: -1 }, mockInput.tickets[1]],
    };
    expect(() => bookingSchema.parse(mock)).toThrow('Quantity must be a positive number');
  });

  it('should call validateUser with correct userId', async () => {
    (bookingsModel.create as jest.Mock).mockResolvedValue({});

    const result = await createBooking!({}, { input: mockInput }, {}, mockInfo);

    expect(validateUser).toHaveBeenCalledWith('507f191e810c19729de860ea');
    expect(result).toBe(Response.Success);
  });

  it('should throw error if user is not found', async () => {
    (validateUser as jest.Mock).mockImplementation(() => {
      throw new Error('User not found');
    });

    await expect(createBooking!({}, { input: mockInput }, {}, mockInfo)).rejects.toThrow('User not found');
  });

  it('should call validateConcert with correct concertId', async () => {
    (bookingsModel.create as jest.Mock).mockResolvedValue({});

    const result = await createBooking!({}, { input: mockInput }, {}, mockInfo);

    expect(validateConcert).toHaveBeenCalledWith('507f191e810c19729de860eb');
    expect(result).toBe(Response.Success);
  });

  it('should throw error if concert is not found', async () => {
    (validateConcert as jest.Mock).mockImplementation(() => {
      throw new Error('Concert not found');
    });

    await expect(createBooking!({}, { input: mockInput }, {}, mockInfo)).rejects.toThrow('Concert not found');
  });

  it('should create a booking successfully', async () => {
    const mockSave1 = jest.fn().mockResolvedValue(undefined);
    const mockSave2 = jest.fn().mockResolvedValue(undefined);

    (ticketModel.findById as jest.Mock)
      .mockResolvedValueOnce({
        _id: '507f191e810c19729de860ec',
        quantity: 5,
        save: mockSave1,
      })
      .mockResolvedValueOnce({
        _id: '507f191e810c19729de860ed',
        quantity: 3,
        save: mockSave2,
      });

    (bookingsModel.create as jest.Mock).mockResolvedValueOnce({ _id: 'mockBooking_id' });
    (userModel.findById as jest.Mock).mockResolvedValueOnce({ _id: '507f191e810c19729de860ea' });
    (concertModel.findById as jest.Mock).mockResolvedValueOnce({ _id: '507f191e810c19729de860eb' });

    const result = await createBooking!({}, { input: mockInput }, {}, mockInfo);

    expect(validateUser).toHaveBeenCalledWith(mockInput.userId);
    expect(validateConcert).toHaveBeenCalledWith(mockInput.concertId);
    expect(DecreaseUtils.decrementTicketStock).toHaveBeenCalledTimes(2);
    expect(calculateTotalAmount).toHaveBeenCalledWith(mockInput.tickets);

    expect(bookingsModel.create).toHaveBeenCalledWith({
      user: mockInput.userId,
      concert: mockInput.concertId,
      tickets: [
        { ticket: '507f191e810c19729de860ec', quantity: 2 },
        { ticket: '507f191e810c19729de860ed', quantity: 1 },
      ],
      totalAmount: 150,
    });

    expect(result).toBe(Response.Success);
  });
  it('throws error with custom message when validateUser throws', async () => {
    jest.spyOn(validateUserModule, 'validateUser').mockRejectedValue(new Error('User not found'));

    await expect(createBooking!({}, {input:mockInput}, {}, mockInfo)).rejects.toThrow('Failed to create booking: User not found');
  });

  it('throws error with custom message when validateConcert throws', async () => {
    jest.spyOn(validateConcertModule, 'validateConcert').mockRejectedValue(new Error('Concert not found'));

    await expect(createBooking!({}, {input:mockInput}, {}, mockInfo)).rejects.toThrow('Failed to create booking: Concert not found');
  });

  it('throws error with "Unknown error" message when a non-Error is thrown', async () => {
    jest.spyOn(validateUserModule, 'validateUser').mockImplementation(() => {
      throw 'User not found';
    });

    await expect(createBooking!({}, {input:mockInput}, {}, mockInfo)).rejects.toThrow('Failed to create booking: Unknown error');
  });
});
