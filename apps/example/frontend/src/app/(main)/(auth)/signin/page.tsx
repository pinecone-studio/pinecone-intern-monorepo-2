'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from 'src/components/providers';

const formSchema = z.object({
  email: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

const SigninPage = () => {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] m-auto flex flex-col gap-10">
        <h1 className="text-2xl font-semibold text-center">Нэвтрэх</h1>

        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Имэйл хаяг</FormLabel>
                <FormControl>
                  <Input className="p-2 rounded-sm" placeholder="Имэйл хаяг" {...field} />
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
                <FormLabel className="text-xs">Нууц үг</FormLabel>
                <FormControl>
                  <Input className="p-2 rounded-sm" placeholder="Нууц үг" {...field} />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <Button className="p-2 text-white bg-black rounded-sm" type="submit">
            Нэвтрэх
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/forget">
            <Button type="reset" variant="ghost" className="w-full text-xs">
              Нууц үг мартсан
            </Button>
          </Link>

          <Link href="/signup">
            <Button type="reset" variant="ghost" className="w-full text-xs">
              Бүртгүүлэх
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SigninPage;
