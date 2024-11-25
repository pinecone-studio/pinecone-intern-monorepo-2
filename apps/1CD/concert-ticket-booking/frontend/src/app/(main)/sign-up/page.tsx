'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

const formSchema = z.object({
  email: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  repeatPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

const inputs = [
  {
    name: 'email',
    label: 'Имэйл хаяг',
  },
  {
    name: 'password',
    label: 'Нууц үг',
  },
  {
    name: 'repeatPassword',
    label: 'Нууц үг давтах',
  },
] as const;

const SignupPage = () => {
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
    console.log('sign up variables', values);
    await handleSignUp({
      email: values.email,
      password: values.password,
    });
  };

  return (
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
                  <FormLabel className="text-xs">{input.label}</FormLabel>
                  <FormControl>
                    <Input className="p-2 rounded-sm" placeholder={input.label} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          ))}

          <Button className="p-2 text-white bg-black rounded-sm" type="submit">
            Бүртгүүлэх
          </Button>
        </div>

        <Link href="/signin">
          <Button type="reset" variant="ghost" className="w-full text-xs">
            Нэвтрэх
          </Button>
        </Link>
      </form>
    </Form>
  );
};

export default SignupPage;
