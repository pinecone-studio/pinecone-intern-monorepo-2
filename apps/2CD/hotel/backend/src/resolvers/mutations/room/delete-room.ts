import { Room } from 'src/models/room.model';

export const deleteRoom = async (_parent: unknown, { id }: { id: string }) => {
  try {
    await Room.findByIdAndDelete(id);
    return {
      success: true,
      message: 'Room deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete room',
    };
  }
};
