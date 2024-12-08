import { createEvent } from '../../../../src/resolvers/mutations/event/create-event';
import Event from '../../../../src/models/event.model';
import Ticket from '../../../../src/models/ticket.model';
import { GraphQLResolveInfo } from 'graphql';
import { EventInput } from '../../../../src/generated';

// Mocking the models
jest.mock('../../../../src/models/event.model', () => ({
  create: jest.fn(),
  findById: jest.fn(),
}));
jest.mock('../../../../src/models/ticket.model', () => ({
  insertMany: jest.fn(),
}));

describe('createEvent mutation', () => {
  const input:EventInput = {
    name: 'Sample Event',
    description: 'Sample Description',
    mainArtists: ['Artist1'],
    guestArtists: ['Artist2'],
    dayTickets: [
      {
        scheduledDay: new Date('2024-12-01'),
        ticketType: [],
      },
      {
        scheduledDay: new Date('2024-12-02'),
        ticketType: [],
      },
    ],
    image: 'sample-image.jpg',
    venue: 'Venue1',
    category: ['Category1'],
  };

  const mockEvent = {
    _id: '1234567890',
    name: 'Sample Event',
    description: 'Sample Description',
    scheduledDays: [new Date('2024-12-01'), new Date('2024-12-02')],
    mainArtists: ['Artist1'],
    guestArtists: ['Artist2'],
    dayTickets: ['ticket1', 'ticket2'],
    image: 'sample-image.jpg',
    venue: 'Venue1',
    category: ['Category1'],
    save: jest.fn(),
  };

  beforeEach(() => {
    // Clear any mock data before each test
    (Ticket.insertMany as jest.Mock).mockClear();
    (Event.create as jest.Mock).mockClear();
    (Event.findById as jest.Mock).mockClear();
  });

  it('should create an event and return the event with populated dayTickets', async () => {
    // Mock the Ticket.insertMany to return mock ticket IDs
    (Ticket.insertMany as jest.Mock).mockResolvedValueOnce([{ _id: 'ticket1' }, { _id: 'ticket2' }]);

    // Mock Event.create to return a mock event object
    (Event.create as jest.Mock).mockResolvedValueOnce(mockEvent);

    // Mock Event.findById to return the same event with populated dayTickets
    (Event.findById as jest.Mock).mockResolvedValueOnce(mockEvent);

    // Call the mutation
    const result = await createEvent!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);

    // Assertions
    expect(Ticket.insertMany).toHaveBeenCalledWith(input.dayTickets); // Ensure the tickets were inserted
    expect(Event.create).toHaveBeenCalledWith({
      name: input.name,
      description: input.description,
      scheduledDays: input.dayTickets.map((item) => item.scheduledDay),
      mainArtists: input.mainArtists,
      guestArtists: input.guestArtists,
      dayTickets: ['ticket1', 'ticket2'],
      image: input.image,
      venue: input.venue,
      category: input.category,
    });

    expect(result).toEqual(mockEvent); // Ensure the result is the mockEvent
    expect(result.scheduledDays).toEqual([new Date('2024-12-01'), new Date('2024-12-02')]); // Check the scheduled days
  });

  it('should handle errors when ticket insertion fails', async () => {
    // Mock the Ticket.insertMany to throw an error
    (Ticket.insertMany as jest.Mock).mockRejectedValueOnce(new Error('Ticket creation failed'));

    try {
      await createEvent!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      // Assertions to ensure the error is thrown as expected
      expect(error).toBeInstanceOf(Error);
    }
  });
});
