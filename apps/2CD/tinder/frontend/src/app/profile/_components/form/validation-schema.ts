import * as yup from 'yup';
import { differenceInYears } from 'date-fns';

// export type FormValues = {
//   name: string;
//   email: string;
//   birthDate: Date | null;
//   gender: 'Male' | 'Female' | 'Other';
//   bio?: string;
//   profession?: string;
//   school?: string;
//   selectedInterests: string[];
// };

export const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  birthDate: yup
  .date()
  .transform((value, originalValue) => {
    return originalValue === '' ? null : value;
  })
  .nullable()
  .required('Birth date is required')
  .test('is-18', 'You must be at least 18 years old', function (value) {
    if (!value) return false;
    return differenceInYears(new Date(), value) >= 18;
  }),
  gender: yup.string().oneOf(['Male', 'Female', 'Other']).required('Gender is required'),
  bio: yup.string(),
  profession: yup.string(),
  school: yup.string(),
  selectedInterests: yup.array().of(yup.string()).max(10, 'Select up to 10 interests'),
});

export type FormValues = yup.InferType<typeof validationSchema>;