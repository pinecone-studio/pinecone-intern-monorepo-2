import { User } from 'src/models/user.model';
import { Types } from 'mongoose';
import { walletHistory } from 'src/models/wallet-notification.model';
type UpdateType = {
  _id: Types.ObjectId;
  price: number;
};

export const updateWallet = async (_: unknown, { input }: { input: UpdateType }) => {
  const { _id, price } = input;

  try {
    const user = await User.findById(_id);
    if (!user) {
      console.log('User not found');
    }
    const increment = (price / 100) * 3;

    const updatedUser = await User.findByIdAndUpdate(_id, { wallet: user.wallet + increment }, { new: true });
    // const updatedUser = await User.findByIdAndUpdate(_id, { wallet: user.wallet + (price / 100) * 3 }, { new: true });
    await walletHistory.create({
      userId: _id,
      amount: Math.floor(increment),
    });

    return updatedUser;
  } catch (error) {
    console.log('Failed to update wallet:', error);
  }
};
