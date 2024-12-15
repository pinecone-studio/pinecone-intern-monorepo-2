import { createEvent } from '../../../../src/resolvers/mutations/event/create-event';
import Event from '../../../../src/models/event.model';
import Ticket from '../../../../src/models/ticket.model';
import { GraphQLResolveInfo } from 'graphql';
import { EventInput } from '../../../../src/generated';

jest.mock('../../../../src/models/event.model', () => ({
  create: jest.fn(),
  findById: jest.fn(),
}));
jest.mock('../../../../src/models/ticket.model', () => ({
  insertMany: jest.fn(),
}));

describe('createEvent mutation', () => {
  const input: EventInput = {
    name: 'Sample Event',
    description: 'Sample Description',
    mainArtists: [{ name: 'Artist1' }],
    guestArtists: [{ name: 'Artist2' }],
    ticketType: [
      {
        zoneName: 'VIP',
        totalQuantity: '100',
        unitPrice: '50.00',
        discount: '10',
        additional: 'VIP perks',
      },
    ],
    image: 'sample-image.jpg',
    discount: '10',
    venue: 'venueId',
    category: ['categoryId'],
    dateRange: {
      from: new Date('2024-12-25T00:00:00+08:00'),
      to: new Date('2024-12-27T00:00:00+08:00'),
    },
    time: {
      hour: '15',
      minute: '00',
    },
  };

  const mockEvent = {
    _id: '1234567890',
    name: 'Sample Event',
    description: 'Sample Description',
    scheduledDays: [new Date('2024-12-25T07:00:00+08:00'), new Date('2024-12-26T07:00:00+08:00'), new Date('2024-12-27T07:00:00+08:00')],
    mainArtists: ['Artist1'],
    guestArtists: ['Artist2'],
    products: ['ticket1', 'ticket2'],
    image: 'sample-image.jpg',
    venue: 'Venue1',
    category: ['Category1'],
    save: jest.fn(),
  };

  beforeEach(() => {
    (Ticket.insertMany as jest.Mock).mockClear();
    (Event.create as jest.Mock).mockClear();
    (Event.findById as jest.Mock).mockClear();
  });

  it('should create an event and return a success message', async () => {
    (Ticket.insertMany as jest.Mock).mockResolvedValueOnce([{ _id: 'ticket1' }, { _id: 'ticket2' }]);
    (Event.create as jest.Mock).mockResolvedValueOnce(mockEvent);

    const result = await createEvent!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);
    expect(result).toEqual({
      message: 'success',
    });
  });

  it('should handle errors if ticket insertion fails', async () => {
    (Ticket.insertMany as jest.Mock).mockRejectedValueOnce(new Error('Ticket creation failed'));
    try {
      await createEvent!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
