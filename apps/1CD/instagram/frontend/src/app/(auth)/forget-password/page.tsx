'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

const Forgetpassword = () => {
  const { forgetPassword } = useAuth();
  const formSchema = z.object({
    email: z.string().min(2, { message: 'This field has to be filled' }).email('This field must to be valid email address'),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await forgetPassword(values);
  };

  return (
    <div className="bg-gray-100 w-screen h-screen flex items-center" data-cy="forget-password-page">
      <div className="w-[364px] h-[493px] bg-white mx-auto rounded-xl">
        <div className="h-full p-6 space-y-3 flex flex-col justify-evenly">
          <div className="flex flex-col items-center mt-5 space-y-3">
            <section className="relative w-16 h-16 border-2 border-black rounded-full">
              <Image src="/images/lock.png" alt="forgetpassword" fill className="absolute p-4" data-cy="forget-password-logo" sizes="h-auto w-auto" />
            </section>
            <h1 className="font-bold">Trouble logging in?</h1>
            <p className="text-center w-[90%] text-gray-600">Enter your email and we will send you a link to get back into your account.</p>
          </div>
          <div className="">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="w-full">
                        <Input {...field} placeholder="Email" type="email" className="w-full" data-cy="forget-password-emailInput" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={!form.formState.isValid} className="bg-blue-500 w-full text-base" data-cy="forget-password-sendlink-button">
                  Send change password link
                </Button>
              </form>
            </Form>
          </div>
          <div className="relative flex flex-col items-center">
            <div className="absolute w-full bottom-[50%] border-b z-10"></div>
            <p className="bg-white px-5 z-50 font-bold">OR</p>
          </div>
          <div className="w-full flex flex-col items-center space-y-5">
            <Link href="/signup">
              <Button variant="link" className="">
                Create new account
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button className="w-full bg-gray-200 text-black text-base hover:text-white" data-cy="forget-password-jump-login">
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Forgetpassword;
