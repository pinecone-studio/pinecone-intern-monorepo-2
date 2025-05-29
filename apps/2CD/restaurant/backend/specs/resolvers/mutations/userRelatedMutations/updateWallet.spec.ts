import { Types } from 'mongoose';
import { updateWallet } from 'src/resolvers/mutations';
import { User } from 'src/models/user.model';

jest.mock('src/models/user.model', () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
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
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockUserId,
      { wallet: finalWalletValue },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedUser);
  });

  it('should log messages and return undefined if the user is not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const input = { _id: mockUserId, price: mockPrice };
    const result = await updateWallet(null, { input });

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(console.log).toHaveBeenCalledWith('User not found');
    expect(console.log).toHaveBeenCalledWith('Failed to update wallet:', expect.any(TypeError));
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should log a message and return undefined if updating the wallet fails (database error)', async () => {
    const initialWalletValue = 500;
    const mockUser = {
      _id: mockUserId,
      wallet: initialWalletValue,
    };
    const databaseError = new Error('Database error');

    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (User.findByIdAndUpdate as jest.Mock).mockRejectedValue(databaseError);

    const input = { _id: mockUserId, price: mockPrice };
    const result = await updateWallet(null, { input });

    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      mockUserId,
      { wallet: initialWalletValue + (mockPrice / 100) * 3 },
      { new: true }
    );
    expect(console.log).toHaveBeenCalledWith('Failed to update wallet:', databaseError);
    expect(result).toBeUndefined();
  });

  it('should correctly calculate the wallet increase', async () => {
    const price1 = 10000;
    const price2 = 5000;
    const price3 = 0;
    const initialWallet = 200;

    const mockUserInstance = { _id: mockUserId, wallet: initialWallet };

    (User.findById as jest.Mock).mockResolvedValue(mockUserInstance);
    (User.findByIdAndUpdate as jest.Mock).mockImplementation(async (_id, update) => {
      return { ...mockUserInstance, wallet: update.wallet };
    });

    let input = { _id: mockUserId, price: price1 };
    let result = await updateWallet(null, { input });
    expect(result.wallet).toBe(initialWallet + (price1 / 100) * 3);

    input = { _id: mockUserId, price: price2 };
    result = await updateWallet(null, { input });
    expect(result.wallet).toBe(initialWallet + (price2 / 100) * 3);

    input = { _id: mockUserId, price: price3 };
    result = await updateWallet(null, { input });
    expect(result.wallet).toBe(initialWallet + (price3 / 100) * 3);
  });
});
