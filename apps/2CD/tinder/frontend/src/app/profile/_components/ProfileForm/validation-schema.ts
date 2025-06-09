import * as Yup from 'yup';
import dayjs from 'dayjs';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  dob: Yup.date()
    .nullable()
    .required('Date of birth is required')
    .test('age', 'You must be at least 18 years old', (value) => {
      if (!value) return false; // хоосон утга байвал алдаа гаргана
      return dayjs().diff(dayjs(value), 'year') >= 18;
    }),
});

export default validationSchema;
