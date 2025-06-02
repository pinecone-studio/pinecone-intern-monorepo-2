import { User } from 'src/models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User doesn't exist");
  return user;
};

export const verifyPassword = async (inputPassword: string, storedHash: string) => {
  const match = await bcrypt.compare(inputPassword, storedHash);
  if (!match) throw new Error('Incorrect password');
  return true;
};

export const generateToken = (user: any) => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      userName: user.userName,
    },
    jwtSecret,
    { expiresIn: '2 days' }
  );
};
