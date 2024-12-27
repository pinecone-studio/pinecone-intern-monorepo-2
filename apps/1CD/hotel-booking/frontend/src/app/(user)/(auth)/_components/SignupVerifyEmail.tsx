'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useSignup } from 'src/components/providers';
import { Label } from '@radix-ui/react-label';
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

const SignupVerifyEmail = () => {
  const { sendOtp } = useSignup();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await sendOtp({ email: values.email });
  };

  return (
    <div className="flex items-center justify-center min-h-screen m-auto" data-cy="Sign-Up-Page">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] flex flex-col gap-10">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Create an account</h1>
            <label className="text-sm font-extralight">Enter your email below to create your account</label>
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
                      <Input className="p-2 rounded-sm" placeholder={input.inputPlaceholder} {...field} data-cy="Sign-Up-Email-Input" />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" data-cy="Sign-Up-Username-Input-Error-Message" />
                  </FormItem>
                )}
              />
            ))}

            <Button className="p-2 text-white bg-blue-600 rounded-sm hover:bg-blue-500" type="submit" data-cy="Sign-Up-Continue-Button">
              Continue
            </Button>
          </div>

          <div className="flex items-center justify-center w-full gap-3">
            <div className="h-[2px] border border-gray-300 w-full"></div>
            <p className="text-[10px] text-gray-400">OR</p>
            <div className="h-[2px] border border-gray-300 w-full"></div>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button type="reset" variant="ghost" className="w-full text-xs border border-gray-200" data-cy="Sign-Up-Log-In-Button">
                Log in
              </Button>
            </Link>
            <Label className="text-sm text-center text-gray-400">By clicking continue, you agree to our Terms of Service and Privacy Policy.</Label>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignupVerifyEmail;
