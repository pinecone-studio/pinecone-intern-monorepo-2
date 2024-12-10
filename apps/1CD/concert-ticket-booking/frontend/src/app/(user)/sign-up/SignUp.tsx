'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { z } from 'zod';
import { formSchema } from '@/utils/validationschema';

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
  const { handleSignUp } = useAuth();

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

  return (
    <div data-cy="Sign-Up-Page" className="flex min-h-[calc(100vh-314px)] bg-black align-center px-4 py-6">
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
                      <Input data-cy={`input-${input.name}`} type={input.type} className="p-2 rounded-sm" placeholder={input.label} {...field} />
                    </FormControl>
                    <FormMessage data-cy={`form-message-${input.name}`} className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <Button data-cy="Sign-Up-Submit-Button" className="w-full p-2 text-white rounded-sm bg-sky-500" type="submit">
              Бүртгүүлэх
            </Button>
            <p className="w-full text-xs text-center text-zinc-400">
              Та бүртгэлтэй хаягтай бол
              <button data-cy="Sign-In-Link-Button">
                <Link href="/sign-in" className="mx-1 underline underline-offset-2 decoration-white hover:text-gray-600 ">
                  нэвтрэх
                </Link>
              </button>
              хэсгээр <br />
              орно уу.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
