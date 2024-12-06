'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm  } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVerifyUserEmailMutation } from '@/generated';
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react';

// Define the schema for validation using zod
const formSchema = z.object({
  email: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
});

// Input configurations for the form
const inputs = [
  {
    name: 'email',
    label: 'Имэйл хаяг', // Change this text as necessary for your application
    type: 'email',
  },

] as const;

const ForgotPassword = () => {

  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  const [userVerifyEmail] = useVerifyUserEmailMutation({
    onCompleted: () => {
      console.log("success")
      form.reset();
    },
    onError: (error) => { 
    console.log("error", error.message)
    },
  });


  // Handle form submission
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    console.log("email", value);
    setIsLoading(true); // Set loading to true when submission starts

    try {
      await userVerifyEmail({
        variables: {
          email: value.email,
        },
      });
    } catch (error) {
      console.error('Error during email verification:', error);
    } finally {
      setIsLoading(false); // Set loading to false when submission is complete
    }
  };

  return (
  
    <div data-cy="Forgot-Password-Page" className='bg-[#27272A]'>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[446px] rounded-2xl bg-[09090B#] m-auto flex flex-col border-[0.1px] border-slate-400 " data-cy="forgot-password-form">
          <h1 className="text-2xl font-semibold text-center mt-8 text-white" data-cy="forgot-password-heading">
            Нууц үг сэргээх
          </h1>
          <div className="flex flex-col gap-4 px-12 py-6">
            {inputs.map((input) => (
              <FormField
                key={input.label}
                control={form.control}
                name={input.name}
                render={({ field }) => (
                  <FormItem data-cy={`form-item-${input.name}`}>
                    <FormLabel className="text-[16px] text-white" data-cy={`form-label-${input.name}`}>
                      {input.label}
                    </FormLabel>
                    <FormControl>
                      <Input type={input.type} className="p-2 rounded-md" placeholder={input.label} {...field} data-cy={`input-${input.name}`} />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" data-cy={`form-message-${input.name}`} />
                  </FormItem>
                )}
              />
            ))}

            <Button className="p-2 w-full text-black bg-[#00B7f4] hover:bg-slate-100 rounded-md" type="submit" data-cy="Forgot-Password-Submit-Button">
            {isLoading ? (
                <Spinner className="w-5 h-5 text-black animate-spin" />
              ) : (
                'Үргэлжлүүлэх'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;
