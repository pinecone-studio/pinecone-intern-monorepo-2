
import jwt from 'jsonwebtoken';
export const createToken = async (user: { email: string; _id: string }) => {  
    const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
    const token = await jwt.sign({ userId: user._id, email: user.email }, TOKEN_SECRET, { expiresIn: '1d' });
    return token;
};
