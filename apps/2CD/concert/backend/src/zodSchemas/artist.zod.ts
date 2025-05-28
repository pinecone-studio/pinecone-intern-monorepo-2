import { z } from 'zod';

export const artistSchema = z.object({
  name: z.string().min(1, 'artist name is required'),
  avatarImage: z.string().url('Thumbnail URL must be a valid URL'),
});
