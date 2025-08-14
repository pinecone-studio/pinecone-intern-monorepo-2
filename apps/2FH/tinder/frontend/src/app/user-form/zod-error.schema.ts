import { z } from 'zod';

export const schemaLawyerProfile = z.object({
  name: z.string().max(50).min(2, { message: 'Өөрийн нэрээ оруулна уу!' }),
  bio: z.string().min(10, { message: 'Араваас илүү тэмдэгт оруулна УУ!' }).max(1000, { message: 'Хязгаар хэтэрсэн байна!' }),
});
