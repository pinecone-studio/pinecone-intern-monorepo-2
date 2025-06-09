import * as Yup from 'yup';

export const profileValidationSchema = Yup.object({
  userId: Yup.string().required('User ID is required'),
  firstName: Yup.string().required('First name is required'),
  age: Yup.number()
    .required('Age is required')
    .min(18, 'You must be at least 18'),
  bio: Yup.string(),
  profession: Yup.string(),
  education: Yup.string(),
  gender: Yup.string().oneOf(['Male', 'Female', 'Other']).required('Gender is required'),
  lookingFor: Yup.string().oneOf(['Male', 'Female', 'Both']).required('Looking For is required'),
  interests: Yup.array().of(Yup.string()).min(1, 'Select at least one interest'),
  isCertified: Yup.boolean().default(false),
  images: Yup.array().of(Yup.string()).min(1, 'At least one image is required'),
});
