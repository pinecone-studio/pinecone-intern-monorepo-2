import { getTicketWithVenue } from '../../../../src/resolvers/queries/ticket/get-ticket-venue';
import { GraphQLResolveInfo } from 'graphql';
import Ticket from '../../../../src/models/ticket.model';
import Venue from '../../../../src/models/venue.model';

jest.mock('../../../../src/models/ticket.model');
jest.mock('../../../../src/models/venue.model');

describe('getTicketWithVenue', () => {
  it('should return ticket and venue when both are found', async () => {
    const mockTicket = { _id: 'ticket123', name: 'Event Ticket' };
    const mockVenue = { _id: 'venue123', name: 'Event Venue' };
    Ticket.findById = jest.fn().mockResolvedValue(mockTicket);
    Venue.findById = jest.fn().mockResolvedValue(mockVenue);
    const result = await getTicketWithVenue!({}, { input: { ticketId: 'ticket123', venueId: 'venue123' } }, { userId: '1' }, {} as GraphQLResolveInfo);
    expect(result.findTicket).toEqual(mockTicket);
    expect(result.findVenue).toEqual(mockVenue);
  });
  it('should throw error if the ticket is not found', async () => {
    const mockVenue = { _id: 'venue123', name: 'Event Venue' };
    Ticket.findById = jest.fn().mockResolvedValue(null);
    Venue.findById = jest.fn().mockResolvedValue(mockVenue);
    try {
      await getTicketWithVenue!({}, { input: { ticketId: 'ticket123', venueId: 'venue123' } }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Ticket or Venue not found'));
    }
  });
  it('should throw error if the venue is not found', async () => {
    const mockTicket = { _id: 'ticket123', name: 'Event Ticket' };
    Ticket.findById = jest.fn().mockResolvedValue(null);
    Venue.findById = jest.fn().mockResolvedValue(mockTicket);
    try {
      await getTicketWithVenue!({}, { input: { ticketId: 'ticket123', venueId: 'venue123' } }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Ticket or Venue not found'));
    }
  });
  it('should throw an Unauthorized error if no userId in context', async () => {
    Ticket.findById = jest.fn();
    Venue.findById = jest.fn();
    try {
      await getTicketWithVenue!({}, { input: { ticketId: 'ticket123', venueId: 'venue123' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });
});
