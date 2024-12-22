'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import LoadingSpinner from '../loading/Loading';

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
  const { handleSignIn, loading } = useAuth();

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
  if (loading) return <LoadingSpinner />;
  return (
    <div
      data-cy="Sign-In-Page"
      className="flex min-h-[calc(100vh-1px)] bg-black align-center px-4 py-6"
      style={{
        background: 'radial-gradient(32.61% 32.62% at 50% 125%, #00B7F4 0%, #0D0D0F 100%)',
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[446px] rounded-2xl bg-[#09090B] m-auto flex flex-col border border-gray-600 py-6 px-6 sm:py-8 sm:px-12 gap-6"
          data-cy="sign-in-form"
        >
          <h1 className="mt-4 text-xl font-semibold text-center text-white sm:mt-8 sm:text-2xl" data-cy="sign-in-heading">
            Нэвтрэх
          </h1>

          <div className="flex flex-col w-full gap-4 ">
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
                      <Input
                        type={input.type}
                        className="p-2 text-white bg-black border-gray-600 rounded-md"
                        placeholder={input.label}
                        {...field}
                        data-cy={`input-${input.name}`}
                        data-testid={`input-${input.name}`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" data-cy={`form-message-${input.name}`} data-testid={`form-message-${input.name}`} />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <Button data-testid="Sign-In-Submit-Button" className="p-2 w-full hover:text-white text-black bg-[#00B7f4] rounded-sm" type="submit" data-cy="Sign-In-Submit-Button">
              Нэвтрэх
            </Button>
            <p className="w-full text-sm text-center text-zinc-400 ">
              Та бүртгэлтэй хаяггүй бол
              <button data-cy="Sign-Up-Link-Button" data-testid="Sign-Up-Link-Button">
                <Link href="/user/sign-up" className="mx-1 underline underline-offset-2 decoration-white hover:text-white ">
                  бүртгүүлэх
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

export default SignIn;
