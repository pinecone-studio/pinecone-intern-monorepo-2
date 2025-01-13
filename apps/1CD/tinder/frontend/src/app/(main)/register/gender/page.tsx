/* eslint-disable camelcase */
'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {useUpdateGenderMutation } from '@/generated';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';

const Gender = () => {
  const [ UpdateGender,{loading}] = useUpdateGenderMutation({
    onCompleted: () => {
      router.push('/register/attraction');
    },
  });

  const FormSchema = z.object({
    interestedIn: z.string({
      message: 'Please select one.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await UpdateGender({
      variables: {
        gender: data.interestedIn,
      },
    });
  };

  return (
    <div className="flex flex-col items-center pt-[80px] min-h-screen justify-between">
      <div className="flex flex-col gap-6 ">
        <div className="flex flex-col items-center gap-6">
          <div data-cy="register-email-header" className="flex items-center gap-1">
            <Image src="/logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
            <div className="text-[#424242] font-bold text-2xl">tinder</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[#09090B] font-semibold text-2xl">How do you identify?</div>
            <div className="text-[#71717A] w-[330px] text-sm font-normal pt-1 text-center">Pick the one that feels right for you!</div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="interestedIn"
                render={({ field }) => (
                  <FormItem data-cy="select-button">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="sm:w-[400px] w-[350px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup data-cy="male-select-content">
                          <SelectItem data-cy="male-select-content-male" value="Male">
                            Male
                          </SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage data-cy="error-message" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <button type="submit" className="bg-[#E11D48E5] w-[64px] h-[36px] rounded-3xl text-white" data-cy="next-button">
                  {loading ? <Image src="/sw.svg" alt="loading" width={20} height={20} className="mx-auto animate-spin" /> : 'Next'}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <p className="text-[#71717A] text-sm pb-[5%]">©2024 Tinder</p>
    </div>
  );
};

export default Gender;
