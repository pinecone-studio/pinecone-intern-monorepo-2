import { User } from 'src/models/user.model';
import { Types } from 'mongoose';

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

    const bonus = user.wallet + (price / 100) * 3;
    const updatedUser = await User.findByIdAndUpdate(_id, { wallet: bonus }, { new: true });

    return updatedUser;
  } catch (error) {
    console.log('Failed to update wallet:', error);
  }
};
