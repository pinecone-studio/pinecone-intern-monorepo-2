import { deleteLastEvent } from '../../../../src/resolvers/mutations/event/delete-last-event';
import Event from '../../../../src/models/event.model';
import { GraphQLResolveInfo } from 'graphql';

// Mock the necessary methods of the Event model
jest.mock('../../../../src/models/event.model', () => ({
  findOne: jest.fn(),
  deleteOne: jest.fn(),
}));

describe('deleteLastEvent Mutation', () => {
  it('should delete the last event and return a success message', async () => {
    const mockEvent = { _id: '1', name: 'Test Event', createdAt: new Date() };

    (Event.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValueOnce(mockEvent),
    });

    (Event.deleteOne as jest.Mock).mockResolvedValueOnce({ deletedCount: 1 });

    const result = await deleteLastEvent!({}, {}, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual({ message: 'Event successfully deleted' });

    expect(Event.deleteOne).toHaveBeenCalledWith({ _id: mockEvent._id });
  });

  it('should throw an error if no events are found', async () => {
    (Event.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValueOnce(null),
    });

    try {
      await deleteLastEvent!({}, {}, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('No events found'));
    }
  });
});
