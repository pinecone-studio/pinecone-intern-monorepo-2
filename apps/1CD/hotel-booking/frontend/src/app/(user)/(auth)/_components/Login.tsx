'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Label } from '@radix-ui/react-label';
import { useAuth } from '@/components/providers';

const Login = () => {
  const formSchema = z.object({
    email: z.string().min(2, {
      message: 'Email must be at least 2 characters.',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
  });
  const { signin } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await signin({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div className="flex items-center justify-center h-screen" data-cy="Login-Page">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] m-auto flex flex-col gap-10">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-center">Sign in</h1>
            <span className="text-gray-400 text-[14px]">Enter your email below to sign in</span>
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Email</FormLabel>
                  <FormControl>
                    <Input className="p-2 rounded-sm" placeholder="name@example.com" {...field} data-cy="Login-Email-Input" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" data-cy="Login-Email-Input-Error-Message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs">Password</FormLabel>
                    <Link href="/forget">
                      <Button type="reset" variant="link" className="w-full text-xs text-[#2563EB]" data-cy="Login-Forget-Password-Button">
                        Forget password?
                      </Button>
                    </Link>
                  </div>
                  <FormControl>
                    <Input className="p-2 rounded-sm" type="password" placeholder="Password" {...field} data-cy="Login-Password-Input" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" data-cy="Login-Password-Input-Error-Message" />
                </FormItem>
              )}
            />

            <Button className="p-2 text-white bg-[#2563EB] hover:bg-blue-500 rounded-sm" type="submit" data-cy="Login-Submit-Button">
              Continue
            </Button>
          </div>
          <div className="flex items-center justify-center w-full gap-3">
            <div className="h-[2px] border border-gray-300 w-full"></div>
            <p className="text-[10px] text-gray-400">OR</p>
            <div className="h-[2px] border border-gray-300 w-full"></div>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/signup">
              <Button type="reset" variant="ghost" className="w-full text-xs border" data-cy="Login-Create-Account-Button">
                Create an account
              </Button>
            </Link>
            <Label className="text-sm text-center text-gray-400">By clicking continue, you agree to our Terms of Service and Privacy Policy.</Label>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
