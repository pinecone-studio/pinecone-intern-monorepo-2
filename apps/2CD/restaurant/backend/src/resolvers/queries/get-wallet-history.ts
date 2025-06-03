import { walletHistory } from 'src/models/wallet-notification.model';

export const walletHistoryQuery = async (_: unknown, arg: { userId: string }) => {
  const { userId } = arg;
  const wallet = await walletHistory.find({ userId });
  return wallet;
};
