'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
// import { useAuth } from 'src/components/providers';

const formSchema = z.object({
  email: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

const SigninPage = () => {
  // const { signin } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (_values: z.infer<typeof formSchema>) => {
    // await signin({
    //   email: values.email,
    //   password: values.password,
    // });
  };

  return (
    <div className="bg-gray-100 w-screen h-screen flex items-center justify-center ">
      <div>
        <div className="bg-white rounded-xl p-10">
          <Form {...form}>
            <div className="w-full flex justify-center p-5">
              <Image alt="" width={150} height={50} src="/images/Vector.png" className="" />
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] m-auto flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="p-2 rounded-lg" placeholder="Mobile Number or Email" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="p-2 rounded-lg" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <Link href="/forget">
                  <Button type="reset" variant="ghost" className="w-full text-xs text-blue-500">
                    Forgot password?
                  </Button>
                </Link>
                <Button className="p-2 text-white bg-blue-500 rounded-lg" type="submit">
                  Log in
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="bg-white rounded-xl flex justify-center items-center mt-5 p-3">
          <p className="text-xs">Don’t have an account?</p>
          <Link href="/signup">
            <Button type="reset" variant="ghost" className="w-full text-xs font-bold text-blue-500">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
