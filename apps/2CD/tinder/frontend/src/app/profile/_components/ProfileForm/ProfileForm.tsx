'use client';

import { useFormik } from 'formik';
import { MenuItem } from "@mui/material";

import SubmitButton from './SubmitButton';
import FormTextField from "./FormTextField";
import InterestSection from './InterestSection';
// import FormDatePicker from './FormDatePicker';
// import validationSchema from './validation-schema';

// mock data for options
const genderOptions = ['Male', 'Female', 'Other'];

type FormValues = {
  name: string;
  email: string;
  birthDate: Date | null;
  gender: string;
  bio: string;
  profession: string;
  school: string;
  selectedInterests: string[];
};

const ProfileForm = () => {
  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      email: '',
      birthDate: null,
      gender: '',
      bio: '',
      profession: '',
      school: '',
      selectedInterests: [],
    },
    // validationSchema,
    onSubmit: (values) => {
      console.log("Submitted:", values);
    },
  });

  return (
    <form className="space-y-8 max-w-3xl mx-auto p-4" onSubmit={formik.handleSubmit} noValidate>
      <div>
        <p className="text-xl font-semibold text-white mb-1">Personal Information</p>
        <p className="text-sm text-gray-400 mb-4">This is how others will see you on the site.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormTextField
          field={formik.getFieldProps('name')}
          meta={formik.getFieldMeta('name')}
          labelText="Name"
          placeholder="Enter your name"
          fullWidth
        />
        <FormTextField
        field={formik.getFieldProps('email')}
        meta={formik.getFieldMeta('email')}
        labelText="Email"
        placeholder="Enter your email"
        fullWidth
        />
      </div>

      {/* <FormDatePicker
        label="Date of Birth"
        value={formik.values.birthDate}
        onChange={(date) => formik.setFieldValue('birthDate', date)}
        error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
        helperText={
          formik.touched.birthDate && formik.errors.birthDate ? formik.errors.birthDate : undefined
        }
      /> */}

      <FormTextField
        field={formik.getFieldProps('gender')}
        meta={formik.getFieldMeta('gender')}
        labelText="Gender"
        fullWidth
        select
      >
        {genderOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </FormTextField>

      <FormTextField
        field={formik.getFieldProps('bio')}
        meta={formik.getFieldMeta('bio')}
        labelText="Bio"
        placeholder="Tell us about yourself"
        fullWidth
        multiline
        rows={3}
      />
      
      <InterestSection formik={formik} />
      
      <FormTextField
        field={formik.getFieldProps('profession')}
        meta={formik.getFieldMeta('profession')}
        labelText="Profession"
        placeholder="Your current profession"
        fullWidth
      />
      
      <FormTextField
        field={formik.getFieldProps('school')}
        meta={formik.getFieldMeta('school')}
        labelText="School/Work"
        placeholder="Your school or workplace"
        fullWidth
      />
      
      <SubmitButton />
    </form>
  );
};

export default ProfileForm;