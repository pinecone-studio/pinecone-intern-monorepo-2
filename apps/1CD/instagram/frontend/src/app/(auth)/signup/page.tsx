'use client';
import AlreadyHaveAnAcc from '@/components/auth/signupCard/AlreadyHaveAnAcc';
import { useAuth } from '@/components/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  email: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
  fullName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  userName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

const inputs: { name: keyof z.infer<typeof formSchema>; label: string }[] = [
  {
    name: 'email',
    label: 'Email',
  },
  {
    name: 'fullName',
    label: 'Full Name',
  },
  {
    name: 'userName',
    label: 'Username',
  },
  {
    name: 'password',
    label: 'Password',
  },
];

const SignupPage = () => {
  const { signup } = useAuth();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      fullName: '',
      userName: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signup(values);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User already exists',
      });
    }
  };
  return (
    <div className="flex flex-col justify-center min-h-screen gap-2 bg-gray-50" data-cy="signup-page">
      <Card className="w-[350px] mx-auto text-center border-none bg-white text-sm text-[#09090B] leading-5 font-normal">
        <CardHeader className="space-y-4">
          <CardTitle className="mt-8">
            <Image src="/images/Logo.png" sizes="h-auto w-auto" alt="Instagram Logo" width={175} height={51} className="mx-auto" />
          </CardTitle>
          <CardDescription className="px-10 text-sm text-[#09090B] leading-5 font-normal">Sign up to see photos and videos from your friends</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid items-center w-full gap-2">
                {inputs.map((input) => (
                  <FormField
                    key={input.label}
                    control={form.control}
                    name={input.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="text-xs px-2 py-[9px]" placeholder={input.label} {...field} data-cy={`signup-input-${input.name}`} />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" data-cy={`signup-input-error-${input.name}`} />
                      </FormItem>
                    )}
                  />
                ))}

                <div className="px-2 mt-2 text-xs text-gray-500">
                  <p className="text-center">
                    People who use our service may have uploaded your contact information to Instagram.
                    <span className="text-[#2563EB] cursor-pointer"> Learn More</span>
                  </p>
                </div>
                <div className="px-2 mt-2 text-xs text-gray-500">
                  <p className="text-center">
                    By signing up, you agree to our
                    <span className="text-[#2563EB] cursor-pointer"> Terms</span>,<span className="text-[#2563EB] cursor-pointer"> Privacy Policy</span> and
                    <span className="text-[#2563EB] cursor-pointer"> Cookies Policy</span>.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button className="w-full bg-[#2563EB80] hover:bg-[#2563EB] text-white" type="submit">
                Sign up
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <AlreadyHaveAnAcc />
    </div>
  );
};

export default SignupPage;
