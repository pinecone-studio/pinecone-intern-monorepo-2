'use client';

import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import CountryCodeInput from '@/app/(user)/(client)/_components/CountryCodeInput';

const ContactInfo = () => {
  const inputs = [
    {
      title: 'phoneNumber',
      label: 'Phone number',
      placeholder: 'Enter your phone number',
    },
    {
      title: 'email',
      label: 'Email adress',
      placeholder: 'Enter your email',
    },
  ] as const;

  const formSchema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
    email: z.string().min(1, 'Email is required'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form Values:', { ...values });
  };
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-semibold">Contact info</p>
        <p className="text-xs text-gray-400">Receive account activity alerts and trip updates by sharing this information</p>
      </div>

      <div className="w-full border border-gray-200" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-4">
          <div className="flex w-full gap-6">
            {inputs.map(({ title, label, placeholder }) => (
              <FormField
                key={title}
                control={form.control}
                name={title}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold ">{label}</FormLabel>
                    <FormControl className="flex gap-2">
                      <div className="flex gap-1">
                        <CountryCodeInput />
                        <Input className=" w-[20rem] p-2 rounded-sm" placeholder={placeholder} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <button type="submit" className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md w-fit hover:bg-blue-700">
            Update Profile
          </button>
        </form>
      </Form>

      <div className="w-full border border-gray-200" />
    </div>
  );
};

export default ContactInfo;
