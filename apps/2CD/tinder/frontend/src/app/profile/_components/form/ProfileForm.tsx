'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema, FormValues } from './validation-schema';

import SubmitButton from './SubmitButton';
import TextInput from './TextInput';
import InterestSection from './InterestSection';
import SelectInput from './SelectInput';
import CalendarInput from './CalendarInput';

const genderOptions = ['Male', 'Female', 'Other'];

const ProfileForm = () => {
  const methods = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      birthDate: undefined,
      gender: 'Male',
      bio: '',
      profession: '',
      school: '',
      selectedInterests: [],
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-8 mx-auto" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <div className="mb-[24px] border-b border-[#444] pb-4">
          <p className="text-xl font-semibold">Personal Information </p>
          <p className="text-sm text-zinc-400 mt-2">This is how others will see you on the site.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput name="name" labelText="Name" placeholder="Enter your name" />
          <TextInput name="email" labelText="Email" placeholder="Enter your email" />
        </div>

        <CalendarInput name="birthDate" control={methods.control} labelText="Date of birth" />

        <SelectInput name="gender" control={methods.control} labelText="Gender Preferences:" options={genderOptions} />

        <TextInput name="bio" labelText="Bio" placeholder="Tell us about yourself" type="textarea" />

        <InterestSection />

        <TextInput name="profession" labelText="Profession" placeholder="Your current profession" />

        <TextInput name="school" labelText="School/Work" placeholder="Your school or workplace" />

        <SubmitButton />
      </form>
    </FormProvider>
  );
};

export default ProfileForm;
