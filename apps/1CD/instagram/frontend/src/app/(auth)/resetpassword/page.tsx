'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useAuth } from '@/components/providers/AuthProvider';

import { toast } from '@/components/ui/use-toast';
import { useSearchParams } from 'next/navigation';

function Token() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get('resetToken');
  return resetToken;
}

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const resetToken = Token();
  const formSchema = z.object({
    newPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    confrimPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confrimPassword: '',
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.confrimPassword !== values.newPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'Your typed passwords it not matched' });
      return new Error('passwords not match');
    }
    // if (!resetToken) {
    //   toast({ variant: 'destructive', title: 'Error', description: 'Token expired' });
    //   return new Error('token expired');
    // }
    await resetPassword({ password: values.confrimPassword, resetToken: resetToken! });
  };

  return (
    <div className="bg-gray-100 w-screen h-screen flex items-center" data-cy="reset-password-page">
      <div className="w-[364px] bg-white mx-auto rounded-xl">
        <div className="h-full p-6 space-y-3 flex flex-col justify-evenly">
          <div className="flex flex-col items-center mt-5 space-y-3 mb-10">
            <section className="">
              <Image src="/images/Logo.png" sizes="h-auto w-auto" alt="Logo" width={175} height={51} className="mx-auto" data-cy="instagram-logo" />
            </section>
            <h1 className="font-bold text-lg">Create A Strong Password</h1>
            <p className="text-center w-[90%] text-gray-600 text-base">
              Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%)
            </p>
          </div>
          <div className="">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center space-y-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="w-full">
                        <Input {...field} placeholder="New password" type="password" className="w-full" data-cy="reset-newPassword-Input" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confrimPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="w-full">
                        <Input {...field} placeholder="New password, again" type="password" className="w-full" data-cy="reset-confrimPassword-Input" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={!form.formState.isValid} className="bg-blue-500 w-full text-base" data-cy="reset-password-button">
                  Reset password
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
