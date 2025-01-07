'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/providers/AuthProvider';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

const LogInPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await login({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User not found',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100 ">
      <div>
        <div className="p-6 py-10 bg-white rounded-xl">
          <Form {...form}>
            <div className="flex justify-center w-full p-5">
              <Image alt="Instagram Logo" width={175} height={51} src="/images/Logo.png" sizes="h-auto w-auto" data-cy="login-logo" />
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] m-auto flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="p-2 rounded-lg" placeholder="Mobile Number or Email" {...field} data-cy="login-input-email" />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" data-cy="login-input-error-email" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="p-2 rounded-lg" placeholder="Password" {...field} data-cy="login-input-password" />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" data-cy="login-input-error-password" />
                    </FormItem>
                  )}
                />
                <Link href="/forget-password">
                  <Button type="reset" variant="link" className="w-full text-sm text-blue-500" data-cy="login-forgot-password">
                    Forgot password?
                  </Button>
                </Link>
                <Button disabled={isLoading} className="p-2 text-white bg-[#2563EB80] hover:bg-[#2563EB] rounded-lg" type="submit" data-cy="login-submit">
                  {isLoading && <span className="absolute left-0 loader"></span>}
                  Log in
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="flex items-center justify-center p-3 mt-5 bg-white rounded-xl">
          <p className="text-sm">Don’t have an account?</p>
          <Link href="/signup">
            <Button type="reset" variant="link" className="w-full text-sm font-bold text-blue-500" data-cy="login-signup-link">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
