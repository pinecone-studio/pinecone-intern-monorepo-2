/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { concertModel } from 'src/models';
import { Types } from 'mongoose';
import { GraphQLResolveInfo } from 'graphql';
import { getConcert } from 'src/resolvers/queries';

// Mock concertModel and its methods
jest.mock('src/models', () => ({
  concertModel: {
    find: jest.fn(() => ({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn(),
    })),
  },
}));

describe('getConcert', () => {
  const mockInfo = {} as GraphQLResolveInfo;
  const mockConcert = {
    _id: new Types.ObjectId(),
    title: 'Rock Show',
    startDate: new Date('2025-06-01T18:00:00.000Z'),
    artists: [{ _id: new Types.ObjectId(), name: 'Artist One' }],
    ticket: { price: 100 },
    venue: { name: 'Stadium' },
    schedule: [{ time: '18:00' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return filtered concerts with converted IDs and date formatting', async () => {
    (concertModel.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValueOnce([mockConcert]),
    });

    const input = {
      title: 'Rock',
      artist: [mockConcert.artists[0]._id.toString()],
      date: '2025-06-01',
    };

    const result = await getConcert!({}, { input }, {}, mockInfo);

    expect(concertModel.find).toHaveBeenCalledWith({
      title: { $regex: 'Rock', $options: 'i' },
      artists: { $all: [mockConcert.artists[0]._id] },
    });

    expect(result).toEqual([
      {
        id: mockConcert._id.toString(),
        title: 'Rock Show',
        startDate: mockConcert.startDate.toISOString(),
        artists: [
          {
            id: mockConcert.artists[0]._id.toString(),
            name: 'Artist One',
          },
        ],
        ticket: { price: 100 },
        venue: { name: 'Stadium' },
        schedule: [{ time: '18:00' }],
      },
    ]);
  });

  it('should return empty array if no concert has valid schedule', async () => {
    const mockNoSchedule = { ...mockConcert, schedule: [] };

    (concertModel.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValueOnce([mockNoSchedule]),
    });

    const input = { title: 'No Show', date: '2025-06-01' };

    const result = await getConcert!({}, { input }, {}, mockInfo);

    expect(result).toEqual([]);
  });
  it('should handle input without date', async () => {
    (concertModel.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValueOnce([]),
    });

    const result = await getConcert!({}, { input: { title: 'Rock' } }, {}, mockInfo);
    expect(result).toEqual([]);
  });
  it('should handle undefined input', async () => {
    (concertModel.find as jest.Mock).mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValueOnce([]),
    });

    const result = await getConcert!({}, {}, {}, mockInfo);
    expect(result).toEqual([]);
  });
});
