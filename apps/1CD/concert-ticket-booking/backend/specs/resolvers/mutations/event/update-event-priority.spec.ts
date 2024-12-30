import { updateEventPriority } from "../../../../src/resolvers/mutations/event/update-event-priority"
import Event from "../../../../src/models/event.model"
import { GraphQLResolveInfo } from "graphql";

jest.mock('../../../../src/models/event.model', () => ({
  findByIdAndUpdate:jest.fn(),
}));

describe('update priority of the event', () => {
const input = {
  priority: 'test'
}; 
const _id = '1'

  it ('should update priority of the event', async () => {
    (Event.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
      _id: "1",
      priority: "test"
    })
    const result = await updateEventPriority!({}, {input, _id}, {userId: '1'}, {} as GraphQLResolveInfo);
    expect (result).toEqual({
      _id: "1",
      priority: "test"
    });
  });
  
  it('should throw an error if user is not found', async () => {
    try {
      await updateEventPriority!({},{input,_id}, {userId: '1'}, {} as GraphQLResolveInfo);
    } catch (err) {
      expect((err as Error).message).toEqual('Failed to update priority');
    }
  });
});  


