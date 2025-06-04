import { Types } from 'mongoose';
import { User } from 'src/models/user.model';
import { walletHistory } from 'src/models/wallet-notification.model';
import { updateWallet } from 'src/resolvers/mutations';
jest.mock('src/models/user.model', () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock('src/models/wallet-notification.model', () => ({
  walletHistory: {
    create: jest.fn(),
  },
}));

describe('updateWallet', () => {
  const mockUserId = new Types.ObjectId();
  const mockPrice = 10000;

  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should update the user wallet successfully', async () => {
    const initialWalletValue = 500;
    const expectedWalletIncrease = (mockPrice / 100) * 3;
    const finalWalletValue = initialWalletValue + expectedWalletIncrease;

    const mockUser = {
      _id: mockUserId,
      wallet: initialWalletValue,
    };

    const mockUpdatedUser = {
      _id: mockUserId,
      wallet: finalWalletValue,
    };

    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedUser);

    const input = { _id: mockUserId, price: mockPrice };
    const result = await updateWallet(null, { input });

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(mockUserId, { wallet: finalWalletValue }, { new: true });
    expect(walletHistory.create).toHaveBeenCalledWith({
      userId: mockUserId,
      amount: Math.floor(expectedWalletIncrease),
    });
    expect(result).toEqual(mockUpdatedUser);
  });

  it('should log messages and return undefined if the user is not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const input = { _id: mockUserId, price: mockPrice };
    const result = await updateWallet(null, { input });

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(console.log).toHaveBeenCalledWith('User not found');
    expect(result).toBeUndefined();
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(walletHistory.create).not.toHaveBeenCalled();
  });

  it('should log a message and return undefined if updating the wallet fails', async () => {
    const initialWalletValue = 500;
    const mockUser = {
      _id: mockUserId,
      wallet: initialWalletValue,
    };
    const dbError = new Error('Database error');

    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (User.findByIdAndUpdate as jest.Mock).mockRejectedValue(dbError);

    const input = { _id: mockUserId, price: mockPrice };
    const result = await updateWallet(null, { input });

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(User.findByIdAndUpdate).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Failed to update wallet:', dbError);
    expect(result).toBeUndefined();
    expect(walletHistory.create).not.toHaveBeenCalled();
  });

  it('should correctly calculate the wallet increase', async () => {
    const prices = [10000, 5000, 0];
    const initialWallet = 200;

    const mockUserInstance = { _id: mockUserId, wallet: initialWallet };

    (User.findById as jest.Mock).mockResolvedValue(mockUserInstance);
    (User.findByIdAndUpdate as jest.Mock).mockImplementation((_id, update) => {
      return { ...mockUserInstance, wallet: update.wallet };
    });

    for (const price of prices) {
      const expectedIncrement = (price / 100) * 3;
      const input = { _id: mockUserId, price };

      const result = await updateWallet(null, { input });

      expect(result.wallet).toBe(initialWallet + expectedIncrement);
      expect(walletHistory.create).toHaveBeenCalledWith({
        userId: mockUserId,
        amount: Math.floor(expectedIncrement),
      });
    }
  });
});
