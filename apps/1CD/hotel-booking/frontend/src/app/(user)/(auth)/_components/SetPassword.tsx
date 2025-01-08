'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useEffect, useState } from 'react';
import { useSignup } from '@/components/providers';

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters long.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Confirm password must be at least 8 characters long.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const SetPassword = () => {
  const { setPassword } = useSignup();

  const [emailOtp, setEmailOtp] = useState<string>('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail')!;

    setEmailOtp(email);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await setPassword({
      password: values.password,
      email: emailOtp,
    });
  };

  return (
    <div className="flex items-center justify-center h-screen" data-cy="Set-Password-Page">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] m-auto flex flex-col gap-10" data-cy="Sign-Up-Submit-Button">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold ">Set new password</h3>
            <span className="text-gray-400 text-[14px]">Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers</span>
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Password</FormLabel>
                  <FormControl>
                    <Input className="p-2 rounded-sm" type="password" placeholder="Password" {...field} data-cy="Sign-Up-Password-Input" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" data-cy="Sign-Up-Password-Input-Error-Message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs">Confirm Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input className="p-2 rounded-sm" type="password" placeholder="Confirm Password" {...field} data-cy="Sign-Up-Confirm-Password-Input" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" data-cy="Sign-Up-Confirm-Password-Input-Error-Message" />
                </FormItem>
              )}
            />

            <Button className="p-2 text-white bg-[#2563EB] hover:bg-blue-500 rounded-sm" type="submit" data-cy="Sign-Up-Submit-Button">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SetPassword;
