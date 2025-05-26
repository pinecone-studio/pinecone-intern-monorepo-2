/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createConcert } from 'src/resolvers/mutations/concert/create-concert.mutation';
import { concertModel, ticketModel } from 'src/models';
import { timeScheduleModel } from 'src/models/timeschedule.model';
import { GraphQLResolveInfo } from 'graphql';
import { Response, TicketType } from 'src/generated';
const mockInput = {
  artists: ['artist'],
  description: 'test',
  schedule: [
    {
      endDate: '2025-06-01T18:00:00.000Z',
      startDate: '2025-06-01T20:00:00.000Z',
    },
  ],
  thumbnailUrl: 'https://exapmle',
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
}));

jest.mock('src/models/timeschedule.model', () => ({
  timeScheduleModel: {
    insertMany: jest.fn(),
  },
}));

describe('createConcert', () => {
  const mockInfo = {} as GraphQLResolveInfo;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if title is empty', async () => {
    const badInput = { ...mockInput, title: '' };

    await expect(createConcert!({}, { input: badInput }, {}, mockInfo)).rejects.toThrow('missing input required');
  });

  it('should throw error if description is empty', async () => {
    const badInput = { ...mockInput, description: '' };

    await expect(createConcert!({}, { input: badInput }, {}, mockInfo)).rejects.toThrow('missing input required');
  });

  it('should throw error if concertModel.create returns null', async () => {
    (concertModel.create as jest.Mock).mockResolvedValueOnce(null);

    await expect(createConcert!({}, { input: mockInput }, {}, mockInfo)).rejects.toThrow('concertModel.create fails.');
  });

  it('should create a concert successfully', async () => {
    (concertModel.create as jest.Mock).mockResolvedValueOnce({ _id: 'mockConcertId' });
    (timeScheduleModel.insertMany as jest.Mock).mockResolvedValueOnce([{ id: 'ts1' }]);
    (ticketModel.insertMany as jest.Mock).mockResolvedValueOnce([{ id: 't1' }]);

    const result = await createConcert!({}, { input: mockInput }, {}, mockInfo);

    expect(concertModel.create).toHaveBeenCalled();
    expect(timeScheduleModel.insertMany).toHaveBeenCalled();
    expect(ticketModel.insertMany).toHaveBeenCalled();
    expect(result).toBe(Response.Success);
  });
});
