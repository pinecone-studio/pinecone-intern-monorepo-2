import { ObjectId } from "mongoose";
import jwt from 'jsonwebtoken';

export const createToken = (user: { _id: ObjectId; userName: string, role: string, position: string, email: string}) => {
    const JWT_SECRET = process.env.JWT_SECRET;
  
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
  
    const payload = {
      userId: user._id,
      username: user.userName,
      role: user.role,
      position: user.position,
      email: user.email
    };
  
    const options = {
      expiresIn: '3h',
    };
  
    // Create the token
    const token = jwt.sign(payload, JWT_SECRET, options);
  
    return token;
  };
  