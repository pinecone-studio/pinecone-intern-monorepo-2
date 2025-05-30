import z from 'zod';

export const updateUserZod = z.object({
  id: z.string().min(1, 'Id is required'),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export const updatePassZod = z.object({
  id: z.string().min(1, 'Id is required'),
  password: z.string().min(1, 'Password is required'),
});
