'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSignup } from 'src/components/providers';
import 'react-toastify/dist/ReactToastify.css';

const formSchema = z.object({
  email: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
});

const inputs = [
  {
    name: 'email',
    label: 'Email',
    inputPlaceholder: 'name@example.com',
  },
] as const;

const ForgetPasswordVerifyEmail = () => {
  const { verifyEmail } = useSignup();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await verifyEmail({ email: values.email });
  };

  return (
    <div className="flex items-center justify-center min-h-screen m-auto" data-cy="Forget-Password-Page">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] flex flex-col gap-10">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Forget password</h1>
            <label className="text-sm font-extralight">Enter your email account to reset password</label>
          </div>

          <div className="flex flex-col gap-4">
            {inputs.map((input) => (
              <FormField
                key={input.label}
                control={form.control}
                name={input.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{input.label}</FormLabel>
                    <FormControl>
                      <Input className="p-2 rounded-sm" placeholder={input.inputPlaceholder} {...field} data-cy="Forget-Password-Page-Email-Input" />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" data-cy="Forget-Password-Page-Username-Input-Error-Message" />
                  </FormItem>
                )}
              />
            ))}

            <Button className="p-2 text-white bg-blue-600 rounded-sm hover:bg-blue-500" type="submit" data-cy="Forget-Password-Page-Continue-Button">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgetPasswordVerifyEmail;
