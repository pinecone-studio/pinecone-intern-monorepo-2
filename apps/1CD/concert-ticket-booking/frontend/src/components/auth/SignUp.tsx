'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

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
    const { password, repeatPassword } = values;
    if (password === repeatPassword) {
      await handleSignUp({
        email: values.email,
        password: values.password,
      });
    }
    return;
  };

  return (
    <div data-cy="Sign-Up-Page">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] m-auto flex flex-col gap-10">
          <h1 className="text-2xl font-semibold text-center">Бүртгүүлэх</h1>

          <div className="flex flex-col gap-4">
            {inputs.map((input) => (
              <FormField
                key={input.label}
                control={form.control}
                name={input.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-cy={`form-label-${input.name}`} className="text-xs">
                      {input.label}
                    </FormLabel>
                    <FormControl data-cy={`input-${input.name}`}>
                      <Input data-cy={`input-${input.name}`} type={input.type} className="p-2 rounded-sm" placeholder={input.label} {...field} />
                    </FormControl>
                    <FormMessage data-cy={`form-message-${input.name}`} className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ))}

            <Button data-cy="Sign-Up-Submit-Button" className="p-2 text-white bg-black rounded-sm" type="submit">
              Бүртгүүлэх
            </Button>
          </div>

          <Link href="/sign-in">
            <Button data-cy="Sign-In-Link-Button" type="reset" variant="ghost" className="w-full text-xs">
              Нэвтрэх
            </Button>
          </Link>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
