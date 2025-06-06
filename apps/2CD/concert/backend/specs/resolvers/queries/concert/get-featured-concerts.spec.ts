/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { concertModel } from 'src/models';
import { getFeaturedConcerts } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  concertModel: {
    aggregate: jest.fn(),
  },
}));
describe('getFeaturedConcerts', () => {
  const mockFeaturedConcerts = [
    {
      _id: 'concert1',
      title: 'Mongolia Music Fest 2025',
      description: 'A major open-air concert featuring popular artists.',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      featured: true,
      totalProfit: 1000000,
      artists: [
        {
          _id: 'artist1',
          name: 'Uka',
          genre: 'Pop',
          imageUrl: 'https://example.com/uka.jpg',
        },
      ],
      schedule: [
        {
          _id: 'schedule1',
          date: '2025-08-15T18:00:00.000Z',
          duration: 120,
        },
      ],
      venue: {
        _id: 'venue1',
        name: 'UB Stadium',
        location: 'Ulaanbaatar',
      },
      ticket: [],
      createdAt: '2025-05-01T10:00:00.000Z',
      updatedAt: '2025-06-01T10:00:00.000Z',
    },
  ];

  it('should return only featered=true concerts', async () => {
    (concertModel.aggregate as jest.Mock).mockResolvedValueOnce(mockFeaturedConcerts);
    const result = await getFeaturedConcerts!({}, {}, {}, {} as GraphQLResolveInfo);
    expect(result).toEqual(mockFeaturedConcerts);
  });
});
