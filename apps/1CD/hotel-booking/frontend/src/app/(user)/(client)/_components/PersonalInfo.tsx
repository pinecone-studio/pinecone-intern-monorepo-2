'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DateOfBirthDatePicker } from './DateOfBirthDatePicker';
import { useUpdateProfile } from '@/components/providers/UpdateUserProvider';
import { useAuth } from '@/components/providers';

const PersonalInfo = () => {
  const [date, setDate] = useState<Date | undefined>();
  const updateProfileData = useUpdateProfile().updateProfileData;
  const { user } = useAuth();

  const inputs = [
    {
      title: 'firstName',
      label: 'First Name',
      placeholder: 'Enter your first name',
    },
    {
      title: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter your last name',
    },
  ] as const;

  const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateProfileData({
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: user?.dateOfBirth || '', // Keep existing value
      phoneNumber: user?.phoneNumber || '', // Keep existing value
      emergencyContact: user?.emergencyContact || '', // Keep existing value
      emergencyStatus: user?.emergencyStatus || null,
    });
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-4">
            <div className="flex flex-col w-full gap-6">
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-semibold">Personal Information</p>
                <p className="text-xs text-gray-400">This is how others will see you on the site.</p>
              </div>

              <div className="w-full border border-gray-200" />

              <div className="flex w-full gap-6 flex-col md:flex-row">
                {inputs.map(({ title, label, placeholder }) => (
                  <FormField
                    key={title}
                    control={form.control}
                    name={title}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold ">{label}</FormLabel>
                        <FormControl>
                          <Input className=" w-[20rem] p-2 rounded-sm" placeholder={placeholder} {...field} />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-lg font-semibold ">Date of Birth</p>
              <DateOfBirthDatePicker date={date} setDate={setDate} />
              <p className="text-xs text-gray-400">Your date of birth is used to calculate your age.</p>
            </div>

            <button type="submit" className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md w-fit hover:bg-blue-700">
              Update Profile
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PersonalInfo;
