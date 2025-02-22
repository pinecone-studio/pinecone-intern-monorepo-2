'use client';

import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import CountryCodeInput from '@/app/(user)/(client)/_components/CountryCodeInput';

const ContactInfo = () => {
  const formSchema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
    email: z.string().min(1, 'Email is required'),
    emergencyPhoneNumber: z.string().min(1, 'Phone number is required'),
    relationship: z.string().min(1, 'Email is required'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      email: '',
      relationship: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form Values:', { ...values });
  };
  return (
    <div className="flex flex-col w-full gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-4">
          <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-semibold">Contact info</p>
              <p className="text-xs text-gray-400">Receive account activity alerts and trip updates by sharing this information</p>
            </div>

            <div className="w-full border border-gray-200" />

            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                key="phoneNumber"
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold ">Phone number</FormLabel>
                    <FormControl className="flex gap-2">
                      <div className="flex gap-1">
                        <CountryCodeInput />
                        <Input className=" w-[20rem] p-2 rounded-sm" placeholder="Enter your phone number" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                key="email"
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold ">Email address</FormLabel>
                    <FormControl className="flex gap-2">
                      <Input className=" w-[20rem] p-2 rounded-sm" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full border border-gray-200" />

            <div className="flex flex-col gap-1">
              <p className="text-2xl font-semibold">Emergency Contact</p>
              <p className="text-xs text-gray-400">In case of emergencies, having someone we can reach out to is essential.</p>
            </div>
            <div className="flex gap-2 flex-col  md:flex-row">
              <FormField
                key="emergencyPhoneNumber"
                control={form.control}
                name="emergencyPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold ">Phone Number</FormLabel>
                    <FormControl className="flex gap-2">
                      <div className="flex gap-1">
                        <CountryCodeInput />
                        <Input className=" w-[20rem] p-2 rounded-sm" placeholder="Enter your emergency contact" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                key="relationship"
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold ">Relationship</FormLabel>
                    <FormControl className="flex gap-2">
                      <div className="flex gap-1">
                        <Input className=" w-[20rem] p-2 rounded-sm" placeholder="Enter your phone number" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <button type="submit" className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md w-fit hover:bg-blue-700">
            Update Profile
          </button>
        </form>
      </Form>
    </div>
  );
};

export default ContactInfo;
