import { walletHistory } from 'src/models/wallet-notification.model';
import { walletHistoryQuery } from 'src/resolvers/queries';
jest.mock('src/models/wallet-notification.model');

describe('walletHistoryQuery', () => {
  const mockUserId = '507f1f77bcf86cd799439011';

  it('should return wallet history for a given user ID', async () => {
    const mockWallets = [
      { _id: '1', userId: mockUserId, amount: 100, createdAt: new Date() },
      { _id: '2', userId: mockUserId, amount: 50, createdAt: new Date() },
    ];

    (walletHistory.find as jest.Mock).mockResolvedValue(mockWallets);

    const result = await walletHistoryQuery(undefined, { userId: mockUserId });

    expect(walletHistory.find).toHaveBeenCalledWith({ userId: mockUserId });
    expect(result).toEqual(mockWallets);
  });
});
