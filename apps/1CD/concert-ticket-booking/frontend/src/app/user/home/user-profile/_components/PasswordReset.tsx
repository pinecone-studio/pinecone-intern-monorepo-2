'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useChangePasswordMutation } from '@/generated';
const PasswordReset = () => {
  const formSchema = z
    .object({
      currentPassword: z.string().min(8, {
        message: 'Current password must be at least 8 characters.',
      }),
      newPassword: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
          message: 'Contain at least one special character.',
        })
        .trim(),
        confirmPassword: z.string().min(8, { message: 'Be at least 8 characters long' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const [updateUser, { loading }] = useChangePasswordMutation({
    onCompleted: () => {
      toast.success('Password successfully updated');  
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Proceed with password update (ensure you securely handle this on the back-end)
    updateUser({
      variables: {
        input: { oldPassword: values.currentPassword,
          newPassword: values.newPassword,},
      },
    });
  };
  return (
    <Form {...form}>
       <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="lg:w-[841px] rounded-2xl bg-[#09090B] flex flex-col border border-gray-600 py-6 px-6 sm:py-8 sm:px-12 gap-6"
      >
        <h1
         data-cy="password-info-heading"
          className="mt-4 text-xl font-semibold text-white sm:mt-8 sm:text-2xl"
        >
          Нууц үг сэргээх
        </h1>
        <div className="flex flex-col w-full gap-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem data-cy="form-item-current-password">
                <FormLabel className="text-xs text-white" data-cy="form-label-current-password">
                  Хуучин нууц үг
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="p-2 text-white bg-black border-gray-600 rounded-md"
                    placeholder="Одоогийн нууц үгээ оруулна уу"
                    {...field}
                    data-cy="input-current-password"
                  />
                </FormControl>
                <FormMessage
                  className="text-xs text-red-500"
                  data-cy="form-message-current-password"
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem data-cy="form-item-new-password">
                <FormLabel className="text-xs text-white" data-cy="form-label-new-password">
                  Шинэ нууц үг
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="p-2 text-white bg-black border-gray-600 rounded-md"
                    placeholder="Шинэ нууц үг оруулна уу"
                    {...field}
                    data-cy="input-new-password"
                  />
                </FormControl>
                <FormMessage
                  className="text-xs text-red-500"
                  data-cy="form-message-new-password"
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem data-cy="form-item-confirm-password">
                <FormLabel className="text-xs text-white" data-cy="form-label-confirm-password">
                  Шинэ нууц үг давтах
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="p-2 text-white bg-black border-gray-600 rounded-md"
                    placeholder="Шинэ нууц үг давтах"
                    {...field}
                    data-cy="input-confirm-password"
                  />
                </FormControl>
                <FormMessage
                  className="text-xs text-red-500"
                  data-cy="form-message-confirm-password"
                />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Loader />
          ) : (
            <Button
              disabled={loading}
              className="p-2 hover:text-white w-[95px] text-black bg-[#00B7f4] rounded-sm"
              type="submit"
              data-cy="Password-Submit-Button"
            >
              Хадгалах
            </Button>
          )}
        </div>
      </form>
    </Form>  );};
export default PasswordReset;