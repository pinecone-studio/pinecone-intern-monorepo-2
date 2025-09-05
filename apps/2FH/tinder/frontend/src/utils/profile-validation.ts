import { z } from 'zod';

// Helper function to calculate age from date
const calculateAge = (dateString: string): number => {
  const birthDate = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  // Насны тооцоолол илүү нарийвчлалтай хийх
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  let actualAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    actualAge = age - 1;
  }

  return actualAge;
};

// Helper function to validate age
const isValidAge = (dateString: string): boolean => {
  const age = calculateAge(dateString);
  return age >= 18;
};

// Helper function to get age error message
const getAgeErrorMessage = (dateString: string): string => {
  const age = calculateAge(dateString);
  if (age < 18) {
    return 'Нас 18 хүрээгүй байна. Та 18 нас хүрэх хүртэл хүлээх хэрэгтэй.';
  }
  return 'Насны алдаа';
};

// Profile үүсгэх validation schema
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Нэр заавал оруулах ёстой')
    .min(2, 'Нэр хамгийн багадаа 2 тэмдэгт байх ёстой')
    .max(50, 'Нэр хамгийн ихдээ 50 тэмдэгт байх ёстой')
    .regex(/^[a-zA-Zа-яА-Я\s]+$/, 'Нэр зөвхөн үсэг агуулж болно'),

  bio: z.string().max(500, 'Bio хамгийн ихдээ 500 тэмдэгт байх ёстой').optional().or(z.literal('')),

  interests: z.string().min(1, 'Сонирхол заавал оруулах ёстой').min(3, 'Сонирхол хамгийн багадаа 3 тэмдэгт байх ёстой').max(200, 'Сонирхол хамгийн ихдээ 200 тэмдэгт байх ёстой'),

  profession: z.string().min(1, 'Мэргэжил заавал оруулах ёстой').min(2, 'Мэргэжил хамгийн багадаа 2 тэмдэгт байх ёстой').max(100, 'Мэргэжил хамгийн ихдээ 100 тэмдэгт байх ёстой'),

  work: z.string().min(1, 'Ажил/Сургууль заавал оруулах ёстой').min(2, 'Ажил/Сургууль хамгийн багадаа 2 тэмдэгт байх ёстой').max(100, 'Ажил/Сургууль хамгийн ихдээ 100 тэмдэгт байх ёстой'),

  dateOfBirth: z
    .string()
    .min(1, 'Төрсөн огноо заавал оруулах ёстой')
    .refine(isValidAge, (date) => ({ message: getAgeErrorMessage(date) })),

  gender: z
    .string()
    .min(1, 'Хүйс заавал сонгох ёстой')
    .refine((gender) => ['Male', 'Female', 'Both', 'Queer'].includes(gender), 'Хүйс зөв сонгогдох ёстой'),

  images: z.array(z.string()).min(1, 'Хамгийн багадаа 1 зураг оруулах ёстой').max(6, 'Хамгийн ихдээ 6 зураг оруулах боломжтой'),

  userId: z.string().min(1, 'User ID заавал байх ёстой'),
});

// Type export
export type ProfileFormData = z.infer<typeof profileSchema>;

// Helper function to extract errors from ZodError
const extractZodErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    if (err.path[0]) {
      errors[err.path[0] as string] = err.message;
    }
  });
  return errors;
};

// Helper function to get error message from ZodError
const getZodErrorMessage = (error: z.ZodError): string => {
  return error.errors[0]?.message || 'Алдаа';
};

// Helper function to handle validation success
const createSuccessResult = () => ({ success: true, errors: {} as Record<string, string> });

// Helper function to handle validation error
const createErrorResult = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return { success: false, errors: extractZodErrors(error) };
  }
  return { success: false, errors: { general: 'Validation алдаа гарлаа' } };
};

// Validation helper functions
export const validateProfile = (data: Partial<ProfileFormData>) => {
  try {
    profileSchema.parse(data);
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
};

// Helper function to handle field validation success
const createFieldSuccessResult = () => ({ success: true, error: null as string | null });

// Helper function to handle field validation error
const createFieldErrorResult = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return { success: false, error: getZodErrorMessage(error) };
  }
  return { success: false, error: 'Validation алдаа' };
};

// Field-specific validation
export const validateField = (field: keyof ProfileFormData, value: unknown) => {
  try {
    const fieldSchema = profileSchema.shape[field];
    fieldSchema.parse(value);
    return createFieldSuccessResult();
  } catch (error) {
    return createFieldErrorResult(error);
  }
};
