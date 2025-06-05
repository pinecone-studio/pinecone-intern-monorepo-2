/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { Response } from 'src/generated';
import { bookingsModel, concertModel, ticketModel, userModel } from 'src/models';
import { createBooking } from 'src/resolvers/mutations';
import { validateConcert } from 'src/utils/create-booking.ts/validate-concert';
import { validateTickets } from 'src/utils/create-booking.ts/validate-tickets';
import { validateUser } from 'src/utils/create-booking.ts/validate-user';
import { bookingSchema } from 'src/zodSchemas/booking.zod';

const mockInput = {
  userId: '507f191e810c19729de860ea',
  concertId: '507f191e810c19729de860eb',
  tickets: [
    { ticketId: '507f191e810c19729de860ec', quantity: 2, price: 1000 },
    { ticketId: '507f191e810c19729de860ed', quantity: 1, price: 1000 },
  ],
};
const ticketIds = mockInput.tickets.map((t) => t.ticketId);

jest.mock('src/utils/create-booking.ts/validate-user', () => ({
  validateUser: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('src/utils/create-booking.ts/validate-concert', () => ({
  validateConcert: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('src/utils/create-booking.ts/validate-tickets', () => ({
  validateTickets: jest.fn().mockResolvedValue(undefined),
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
    find: jest.fn(),
  },
}));

describe('createBooking Mutation', () => {
  const mockInfo = {} as GraphQLResolveInfo;

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('should fail when price is zero', () => {
    const mock = {
      ...mockInput,
      tickets: [{ ...mockInput.tickets[0], price: 0 }, mockInput.tickets[1]],
    };
    expect(() => bookingSchema.parse(mock)).toThrow('Price must be a positive number');
  });

  it('should fail when price is negative', () => {
    const mock = {
      ...mockInput,
      tickets: [{ ...mockInput.tickets[0], price: -100 }, mockInput.tickets[1]],
    };
    expect(() => bookingSchema.parse(mock)).toThrow('Price must be a positive number');
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
  
it('should throw error when some tickets are missing', async () => {
  (ticketModel.find as jest.Mock).mockResolvedValue([{ _id: '507f191e810c19729de860ec' }]);
  (validateTickets as jest.Mock).mockImplementation(() => {
    throw new Error('One or more tickets not found');
  });

  await expect(createBooking!({}, { input: mockInput }, {}, mockInfo)).rejects.toThrow('One or more tickets not found');
});

  it('should call ticketModel.find with correct query', async () => {
    (bookingsModel.create as jest.Mock).mockResolvedValue({});

    const result = await createBooking!({}, { input: mockInput }, {}, mockInfo);
    await validateTickets(ticketIds);

    expect(validateTickets).toHaveBeenCalledWith(['507f191e810c19729de860ec', '507f191e810c19729de860ed' ]);
    expect(result).toBe(Response.Success);
  });

  it('should create a concert successfully', async () => {
    (bookingsModel.create as jest.Mock).mockResolvedValueOnce({ _id: 'mockBooking_id' });
    (userModel.findById as jest.Mock).mockResolvedValueOnce({ _id: '507f191e810c19729de860ea' });
    (concertModel.findById as jest.Mock).mockResolvedValueOnce({ _id: '507f191e810c19729de860eb' });
    (ticketModel.find as jest.Mock).mockResolvedValueOnce([
      { _id: '507f191e810c19729de860ec', quantity: 2, price: 1000 },
      { _id: '507f191e810c19729de860ed', quantity: 1, price: 1000 },
    ]);
    const result = await createBooking!({}, { input: mockInput }, {}, mockInfo);
    expect(validateUser).toHaveBeenCalledWith(mockInput.userId);
    expect(validateConcert).toHaveBeenCalledWith(mockInput.concertId);
    expect(validateTickets).toHaveBeenCalledWith(mockInput.tickets.map((t) => t.ticketId));
    expect(bookingsModel.create).toHaveBeenCalled();
    expect(result).toBe(Response.Success);
  });
});
