import z from 'zod';
export const updateReqZod = z.object({
  id: z.string().min(1, 'Id required'),
});
