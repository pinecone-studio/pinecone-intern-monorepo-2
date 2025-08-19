import { RoomModel } from 'src/models';
import { GraphQLError } from 'graphql';
import { Response } from 'src/generated';
import { deleteRoom } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  RoomModel: {
    findByIdAndDelete: jest.fn(),
  },
}));

describe('deleteRoom mutation', () => {
  const mockContext = {} as any;
  const mockInfo = {} as any;

  afterEach(() => jest.clearAllMocks());

  it('should return Response.Success when room is deleted', async () => {
    (RoomModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({ _id: '123' });

    const result = await deleteRoom!({}, { id: 'some-id' }, mockContext, mockInfo);

    expect(RoomModel.findByIdAndDelete).toHaveBeenCalledWith('some-id');
    expect(result).toBe(Response.Success);
  });

  it('should throw GraphQLError when room id does not exist', async () => {
    (RoomModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

    await expect(deleteRoom!({}, { id: 'nonexistent-id' }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('should throw GraphQLError when delete fails', async () => {
    (RoomModel.findByIdAndDelete as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(deleteRoom!({}, { id: 'some-id' }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
