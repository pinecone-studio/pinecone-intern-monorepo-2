import User from '../../../models/user';
import { Context } from '../../../types/context';

interface UserShape {
  _id: string;
  [key: string]: unknown;
}
interface ContextWithUser extends Context {
  user?: UserShape;
}

export const me = async (_: unknown, __: unknown, context: ContextWithUser) => {
  if (!context.user || !context.user._id) {
    return null;
  }
  const user = await User.findById(context.user._id);
  return user;
};
