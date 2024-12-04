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
  password: z.string().min(8, { message: 'Be at least 8 characters long' }).trim(),
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
] as const;

const SignIn = () => {
  const { handleSignIn } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await handleSignIn({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div data-cy="Sign-In-Page">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[446px] rounded-2xl bg-[#09090B] m-auto flex flex-col" data-cy="sign-in-form">
          <h1 className="text-2xl font-semibold text-center mt-8 text-white" data-cy="sign-in-heading">
            Нэвтрэх
          </h1>

          <div className="flex flex-col gap-4 px-12  pt-6 ">
            {inputs.map((input) => (
              <FormField
                key={input.label}
                control={form.control}
                name={input.name}
                render={({ field }) => (
                  <FormItem data-cy={`form-item-${input.name}`}>
                    <FormLabel className="text-xs text-white" data-cy={`form-label-${input.name}`}>
                      {input.label}
                    </FormLabel>
                    <FormControl>
                      <Input type={input.type} className="p-2 rounded-sm" placeholder={input.label} {...field} data-cy={`input-${input.name}`} />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" data-cy={`form-message-${input.name}`} />
                  </FormItem>
                )}
              />
            ))}

            <Button className="p-2 w-full text-black bg-[#00B7f4] rounded-sm" type="submit" data-cy="Sign-In-Submit-Button">
              Нэвтрэх
            </Button>
            <p className="w-full text-white text-xs text-center">
              Та бүртгэлтэй хаяггүй бол
              <button data-cy="Sign-Up-Link-Button">
                <Link href="/sign-up" className="mx-1 underline underline-offset-2 decoration-white ">
                  бүртгүүлэх
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

export default SignIn;
