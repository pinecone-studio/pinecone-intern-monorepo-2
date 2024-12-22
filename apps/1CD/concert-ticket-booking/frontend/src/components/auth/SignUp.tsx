'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { z } from 'zod';
import LoadingSpinner from '../loading/Loading';

const inputs = [
  {
    name: 'email',
    label: 'Имэйл хаяг',
    type: 'email',
  },
  {
    name: 'password',
    label: 'Нууц үг',
    type: 'password',
  },
  {
    name: 'repeatPassword',
    label: 'Нууц үг давтах',
    type: 'password',
  },
] as const;

const SignUp = () => {
  const { handleSignUp, loading } = useAuth();

  const formSchema = z
    .object({
      email: z.string().min(2, {
        message: 'Email must be at least 2 characters.',
      }),
      password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
          message: 'Contain at least one special character.',
        })
        .trim(),
      repeatPassword: z.string().min(8, { message: 'Be at least 8 characters long' }),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: 'Passwords do not match',
      path: ['repeatPassword'],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await handleSignUp({
      email: values.email,
      password: values.password,
    });
  };
  if (loading) return <LoadingSpinner />;
  return (
    <div
      data-cy="Sign-Up-Page"
      className="flex min-h-[calc(100vh-1px)] bg-black align-center px-4 py-6"
      style={{
        background: 'radial-gradient(32.61% 32.62% at 50% 125%, #00B7F4 0%, #0D0D0F 100%)',
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[446px] flex flex-col gap-6 m-auto align-center border border-gray-600 rounded-lg py-6 px-6 sm:py-8 sm:px-12">
          <h1 className="text-xl text-center text-white sm:text-2xl">Бүртгүүлэх</h1>

          <div className="flex flex-col gap-4">
            {inputs.map((input) => (
              <FormField
                key={input.label}
                control={form.control}
                name={input.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-cy={`form-label-${input.name}`} className="text-xs text-white">
                      {input.label}
                    </FormLabel>
                    <FormControl data-cy={`input-${input.name}`} className="text-white bg-black border border-gray-600 rounded-md">
                      <Input data-cy={`input-${input.name}`} data-testid={`input-${input.name}`} type={input.type} className="p-2 rounded-sm" placeholder={input.label} {...field} />
                    </FormControl>
                    <FormMessage data-cy={`form-message-${input.name}`} className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <Button data-cy="Sign-Up-Submit-Button" data-testid="Sign-Up-Submit-Button" className="w-full p-2 text-black hover:text-white rounded-sm bg-sky-500" type="submit">
              Бүртгүүлэх
            </Button>
            <p className="w-full text-xs text-center text-zinc-400">
              Та бүртгэлтэй хаягтай бол
              <button data-cy="Sign-In-Link-Button" data-testid="Sign-In-Link-Button">
                <Link href="/user/sign-in" className="mx-1 underline underline-offset-2 decoration-white hover:text-gray-600 ">
                  нэвтрэх
                </Link>
              </button>
              хэсгээр <br />
              орно уу.
            </p>
            <button data-cy="Verify-Email-Link-Button" data-testid="Verify-Email-Link-Button" className="text-xs text-center text-zinc-400">
              <Link href="/user/verify-email" className="mx-1 underline underline-offset-2 decoration-white hover:text-white ">
                Нууц үг сэргээх
              </Link>
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
