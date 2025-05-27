/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createConcert } from 'src/resolvers/mutations/concert/create-concert.mutation';
import { concertModel, ticketModel, venueModel } from 'src/models';
import { timeScheduleModel } from 'src/models/timeschedule.model';
import { GraphQLResolveInfo } from 'graphql';
import { Response, TicketType } from 'src/generated';
import { concertSchema } from 'src/zodSchemas';

const mockInput = {
  artists: ['artist'],
  description: 'test',
  schedule: [
    {
      endDate: '2025-06-01T18:00:00.000Z',
      startDate: '2025-06-01T10:00:00.000Z',
    },
  ],
  thumbnailUrl: 'https://exapmle/image.jpg',
  ticket: [
    {
      price: 10,
      quantity: 1,
      type: TicketType.Vip,
    },
  ],
  title: 'title1',
  venueId: 'vendor123',
};

jest.mock('src/models', () => ({
  concertModel: {
    create: jest.fn(),
  },
  ticketModel: {
    insertMany: jest.fn(),
  },
  venueModel: {
    findById: jest.fn(),
  },
  timeScheduleModel: {
    insertMany: jest.fn(),
    find: jest.fn(),
  },
}));

jest.mock('src/models/timeschedule.model', () => ({
  timeScheduleModel: {
    insertMany: jest.fn(),
    find: jest.fn(),
  },
}));

describe('createConcert', () => {
  const mockInfo = {} as GraphQLResolveInfo;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass validation for valid input', () => {
    expect(() => concertSchema.parse(mockInput)).not.toThrow();
  });

  it('should throw error if title is empty', () => {
    const input = { ...mockInput, title: '' };
    expect(() => concertSchema.parse(input)).toThrow('Title cannot be empty');
  });

  it('should throw error if thumbnailUrl is not a URL', () => {
    const input = { ...mockInput, thumbnailUrl: 'not-a-url' };
    expect(() => concertSchema.parse(input)).toThrow('Thumbnail URL must be a valid URL');
  });

  it('should throw error if no artists are provided', () => {
    const input = { ...mockInput, artists: [] };
    expect(() => concertSchema.parse(input)).toThrow('At least one artist is required');
  });

  it('should throw error if ticket price is negative', () => {
    const input = {
      ...mockInput,
      ticket: [{ price: -10, quantity: 10, type: 'VIP' }],
    };
    expect(() => concertSchema.parse(input)).toThrow('Price must be a positive number');
  });

  it('should throw error if no schedule is provided', () => {
    const input = { ...mockInput, schedule: [] };
    expect(() => concertSchema.parse(input)).toThrow('At least one schedule entry is required');
  });
  it('should throw error if end date lower than starts date', () => {
    const input = {
      ...mockInput,
      schedule: [
        {
          startDate: '2025-06-01T20:00:00.000Z',
          endDate: '2025-06-01T18:00:00.000Z',
        },
      ],
    };
    expect(() => concertSchema.parse(input)).toThrow('startDate must be before endDate');
  });
  it('should throw error if venue not fount', async () => {
    (venueModel.findById as jest.Mock).mockResolvedValueOnce(null);
    await expect(createConcert!({}, { input: mockInput }, {}, mockInfo)).rejects.toThrow('venue not found');
  });
  it('should throw error if schedule is exist', async () => {
    (venueModel.findById as jest.Mock).mockResolvedValueOnce({ _id: 'id' });
    (timeScheduleModel.find as jest.Mock).mockResolvedValueOnce([{ _id: 't1' }]);
    await expect(createConcert!({}, { input: mockInput }, {}, mockInfo)).rejects.toThrow('Schedule already exists');
  });
  it('should create a concert successfully', async () => {
    (timeScheduleModel.find as jest.Mock).mockResolvedValueOnce([]);
    (concertModel.create as jest.Mock).mockResolvedValueOnce({ _id: 'mockConcertId' });
    (timeScheduleModel.insertMany as jest.Mock).mockResolvedValueOnce([{ id: 'ts1' }]);
    (ticketModel.insertMany as jest.Mock).mockResolvedValueOnce([{ id: 't1' }]);
    (venueModel.findById as jest.Mock).mockResolvedValueOnce({ id: 'vendor123' });

    const result = await createConcert!({}, { input: mockInput }, {}, mockInfo);

    expect(concertModel.create).toHaveBeenCalled();
    expect(timeScheduleModel.insertMany).toHaveBeenCalled();
    expect(ticketModel.insertMany).toHaveBeenCalled();
    expect(result).toBe(Response.Success);
  });
});
