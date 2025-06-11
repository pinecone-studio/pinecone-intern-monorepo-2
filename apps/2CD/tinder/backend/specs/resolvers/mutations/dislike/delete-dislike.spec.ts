process.env.NODE_ENV = 'test';
jest.setTimeout(30000);
jest.mock('../../../../src/models/dislike', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  }
}));

jest.mock('../../../../src/models/user', () => ({
  __esModule: true,
  default: {
    findByIdAndUpdate: jest.fn(),
  }
}));

import { GraphQLError } from 'graphql';
import Dislike from '../../../../src/models/dislike';
import { deleteDislike } from '../../../../src/resolvers/mutations/dislike/delete-dislike';
import User from '../../../../src/models/user';

describe('deleteDislike', () => {
  const dislikeId = '507f1f77bcf86cd799439011';
  const senderId = '507f1f77bcf86cd799439012';
  const receiverId = '507f1f77bcf86cd799439013';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should delete a dislike successfully', async () => {
    const mockDislike = {
      _id: dislikeId,
      sender: senderId,
      receiver: receiverId,
    };

    (Dislike.findById as jest.Mock).mockResolvedValueOnce(mockDislike);
    (Dislike.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockDislike);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

    const result = await deleteDislike({}, { id: dislikeId });

    expect(result).toBe(true);
    expect(Dislike.findById).toHaveBeenCalledWith(dislikeId);
    expect(Dislike.findByIdAndDelete).toHaveBeenCalledWith(dislikeId);
    expect(User.findByIdAndUpdate).toHaveBeenCalledTimes(2);
  });

  it('should throw error if dislike not found', async () => {
    (Dislike.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(deleteDislike({}, { id: dislikeId }))
      .rejects.toThrow(new GraphQLError('Dislike олдсонгүй', {
        extensions: { code: 'NOT_FOUND' },
      }));
  });

  it('should throw error if database operation fails', async () => {
    const dbError = new Error('Database error');
    (Dislike.findById as jest.Mock).mockRejectedValueOnce(dbError);

    await expect(deleteDislike({}, { id: dislikeId }))
      .rejects.toThrow(new GraphQLError('Алдаа гарлаа', {
        extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: dbError },
      }));
  });
}); 