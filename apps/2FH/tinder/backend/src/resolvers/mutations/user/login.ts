import { User } from '../../../models';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (_: any, { email, password }: { email: string; password: string }, context: any, info: any) => {
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return {
                status: 'ERROR',
                message: 'Email address not registered',
                token: undefined,
                user: undefined
            };
        }

        // Verify password
        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
            return {
                status: 'ERROR',
                message: 'Incorrect password',
                token: undefined,
                user: undefined
            };
        }

        // Check if JWT secret is configured
        if (!process.env.JWT_SECRET) {
            return {
                status: 'ERROR',
                message: 'JWT secret is not configured',
                token: undefined,
                user: undefined
            };
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return {
            status: 'Success',
            message: 'Login successful',
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                status: 'ERROR',
                message: error.message,
                token: undefined,
                user: undefined
            };
        }
        return {
            status: 'ERROR',
            message: 'Unknown error during login',
            token: undefined,
            user: undefined
        };
    }
}; 