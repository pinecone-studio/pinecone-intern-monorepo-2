'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from 'src/components/providers';
import { useSearchParams } from 'next/navigation';

const formSchema = z.object({
  password: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
  otp: z.string().length(6, {
    message: 'OTP must be 6 characters.',
  }),
});

const ChangePasswordPage = () => {
  const searchParams = useSearchParams();

  const { changePassword } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      otp: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await changePassword({
      password: values.password,
      otp: values.otp,
      email: searchParams.get('email') as string,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] m-auto flex flex-col gap-10">
        <h1 className="text-2xl font-semibold text-center">Нэвтрэх</h1>

        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Шинэ нууц үг</FormLabel>
                <FormControl>
                  <Input className="p-2 rounded-sm" placeholder="Шинэ нууц үг" {...field} />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">OTP</FormLabel>
                <FormControl>
                  <Input className="p-2 rounded-sm" placeholder="OTP" {...field} />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <Button className="p-2 text-white bg-black rounded-sm" type="submit">
            Нууц үг солих
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChangePasswordPage;
