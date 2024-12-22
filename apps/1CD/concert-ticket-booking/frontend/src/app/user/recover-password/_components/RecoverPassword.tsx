'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useRecoverPasswordMutation } from '@/generated';
import { Loader } from 'lucide-react';

const inputs = [
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
const formSchema = z
  .object({
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

const RecoverPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get('resetToken');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
  });
  const [recoverPassword, { loading }] = useRecoverPasswordMutation({
    onCompleted: () => {
      toast.success('Successfully recovered password');
      router.push('/user/sign-in');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (resetToken) {
      recoverPassword({ variables: { input: { resetToken, password: values.password } } });
    } else {
      toast.error('Please ensure you are using the correct link or request a new password recovery link.');
    }
  };
  return (
    <div
      data-cy="Recover-Password-Page"
      className="flex min-h-[calc(100vh-1px)] bg-black align-center px-4 py-6"
      style={{
        background: 'radial-gradient(32.61% 32.62% at 50% 125%, #00B7F4 0%, #0D0D0F 100%)',
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[446px] flex flex-col gap-6 m-auto align-center border border-gray-600 rounded-lg py-6 px-6 sm:py-8 sm:px-12">
          <h1 className="text-xl text-center text-white sm:text-2xl">Нууц үг сэргээх</h1>
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
          {loading ? (
            <Loader />
          ) : (
            <Button data-cy="Recover-Password-Submit-Button" className="w-full p-2 hover:text-white text-black rounded-sm bg-sky-500" type="submit" disabled={loading}>
              Илгээх
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
export default RecoverPassword;
