'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignup } from '@/components/providers';

const inputs = [
  {
    name: 'password',
    label: 'New Password',
    inputPlaceholder: 'New Password',
  },
  {
    name: 'rePassword',
    label: 'Confirm Password',
    inputPlaceholder: 'Confirm password',
  },
] as const;

const UpdatePassword = () => {
  const formSchema = z
    .object({
      password: z.string().min(6, {
        message: 'Email must be at least 2 characters.',
      }),
      rePassword: z.string().min(6, {
        message: 'Email must be at least 2 characters.',
      }),
    })
    .superRefine(({ rePassword, password }, ctx) => {
      if (rePassword !== password) {
        ctx.addIssue({
          code: 'custom',
          message: 'The passwords did not match',
          path: ['confirmPassword'],
        });
      }
    });
  const { updatePassword } = useSignup();

  const [emailOtp, setEmailOtp] = useState<string>('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail')!;
    setEmailOtp(email);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updatePassword({
      password: values.password,
      email: emailOtp,
    });
  };
  return (
    <div className="flex items-center justify-center min-h-screen m-auto ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] flex flex-col gap-10">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Forget password</h1>
            <label className="text-sm font-extralight">Enter your email account to reset password</label>
          </div>

          <div className="flex flex-col gap-4">
            {inputs.map((input) => (
              <FormField
                key={input.label}
                control={form.control}
                name={input.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm ">{input.label}</FormLabel>
                    <FormControl>
                      <Input className="p-2 rounded-sm" placeholder={input.inputPlaceholder} type="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ))}

            <Button className="p-2 text-white bg-blue-600 rounded-sm hover:bg-blue-500" type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdatePassword;
