'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

const formSchema = z.object({
  email: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
});
type VerifyEmailParams = {
  variables: {
    email: string;
  };
};
type VerifyEmail = {
  setEmail: Dispatch<SetStateAction<string>>;
  verifyUserEmail: (_params: VerifyEmailParams) => void;
  loading: boolean;
};
const VerifyEmail = ({ setEmail, verifyUserEmail, loading }: VerifyEmail) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    setEmail(value.email);
    verifyUserEmail({ variables: value });
  };
  return (
    <div
      className="flex min-h-[calc(100vh-1px)] bg-black align-center px-4 py-6"
      style={{
        background: 'radial-gradient(32.61% 32.62% at 50% 125%, #00B7F4 0%, #0D0D0F 100%)',
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[446px] rounded-2xl bg-[#09090B] m-auto flex flex-col border border-gray-600 py-6 px-6 sm:py-8 sm:px-12 gap-6"
          data-cy="sign-in-form"
        >
          <h1 className="mt-4 text-xl font-semibold text-center text-white sm:mt-8 sm:text-2xl" data-cy="sign-in-heading">
            Нэвтрэх
          </h1>

          <div className="flex flex-col w-full gap-4 ">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem data-cy="form-item-email">
                  <FormLabel className="text-xs text-white" data-cy="form-label-email">
                    Нууц үг сэргээх
                  </FormLabel>
                  <FormControl>
                    <Input type="email" className="p-2 text-white bg-black border-gray-600 rounded-md" placeholder="name@example.com" {...field} data-cy="input-email" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" data-cy="form-message-email" />
                </FormItem>
              )}
            />
          </div>
          {loading ? (
            <Loader />
          ) : (
            <Button disabled={loading} data-cy="Verify-Email-Submit-Button" className="p-2 w-full hover:text-white text-black bg-[#00B7f4] rounded-sm" type="submit">
              Үргэжлүүлэх
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default VerifyEmail;
