'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useState } from 'react';

const Forgetpassword = () => {
  const [emailInput, setEmailInput] = useState('');
  const formSchema = z.object({
    email: z.string().min(2, { message: 'This field has to be filled' }).email('This is not valid email address'),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  // console.log('handle submitiig harah');

  return (
    <div className="bg-gray-100 w-screen h-screen flex items-center">
      <div className="w-[364px] h-[493px] bg-white mx-auto rounded-xl">
        <div className="h-full p-6 space-y-3 flex flex-col justify-evenly">
          <div className="flex flex-col items-center mt-5 space-y-3">
            <section className="relative w-16 h-16 border-2 border-black rounded-full">
              <Image src="/lock.png" alt="forgetpassword" fill className="absolute p-4" />
            </section>
            <h1 className="font-bold">Trouble logging in?</h1>
            <p className="text-center w-[90%] text-gray-600">Enter your email and we will send you a link to get back into your account.</p>
          </div>
          <div className="">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="w-full">
                        <Input {...field} placeholder="Email" type="email" className="w-full" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {emailInput.length === 0 && (
                  <Button disabled type="submit" className="bg-blue-500 w-full text-base">
                    Send change password link
                  </Button>
                )}
                {emailInput.length > 0 && (
                  <Button type="submit" className="bg-blue-500 w-full text-base">
                    Send change password link
                  </Button>
                )}
              </form>
            </Form>
          </div>
          <div className="relative flex flex-col items-center">
            <div className="absolute w-full bottom-[50%] border-b z-10"></div>
            <p className="bg-white px-5 z-50 font-bold">OR</p>
          </div>
          <div className="flex flex-col items-center space-y-5">
            <p className="">Create new account</p>
            <Button className="w-full bg-gray-200 text-black text-base">Back to login</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Forgetpassword;
