'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/components/providers/AuthProvider';
import { useUpdateUserMutation } from '@/generated';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';

const formSchema = z.object({
  email: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
  phoneNumber: z.string().min(10, { message: 'Must be a valid mobile number' }).max(14, { message: 'Must be a valid mobile number' }),
});
const inputs = [
  {
    name: 'phoneNumber',
    label: 'Утасны дугаар',
    type: 'text',
  },
  {
    name: 'email',
    label: 'Имэйл хаяг',
    type: 'email',
  },
] as const;

const UserInfo = () => {
  const { user, setRefresh } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
    },
  });

  const [updateUser, { loading }] = useUpdateUserMutation({
    onCompleted: () => {
      toast.success('Successfully updated');
      setRefresh((pre) => !pre);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateUser({ variables: { input: { email: values.email, phoneNumber: values.phoneNumber } } });
  };
  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        phoneNumber: user?.phoneNumber ?? '',
      });
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="xl:w-[841px] md:w-[400px] sm:w-[200px] rounded-2xl bg-[#09090B] m-auto flex flex-col border border-gray-600 py-6 px-6 sm:py-8 sm:px-12 gap-6">
        <h1 data-cy="user-info-heading" className="mt-4 text-xl font-semibold text-white sm:mt-8 sm:text-2xl">
          Хэрэглэгчийн мэдээлэл
        </h1>
        <div className="flex flex-col w-full gap-4 ">
          {inputs.map((input) => (
            <FormField
              key={input.label}
              control={form.control}
              name={input.name}
              render={({ field }) => (
                <FormItem data-cy={`form-item-${input.name}`}>
                  <FormLabel className="text-xs text-white" data-cy={`form-label-${input.name}`}>
                    {input.label}
                  </FormLabel>
                  <FormControl>
                    <Input type={input.type} className="p-2 text-white bg-black border-gray-600 rounded-md" placeholder={input.label} {...field} data-cy={`input-${input.name}`} />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" data-cy={`form-message-${input.name}`} />
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Loader />
          ) : (
            <Button disabled={loading} className="p-2 hover:text-white w-[95px]  text-black bg-[#00B7f4] rounded-sm" type="submit" data-cy="Info-Submit-Button">
              Хадгалах
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default UserInfo;

