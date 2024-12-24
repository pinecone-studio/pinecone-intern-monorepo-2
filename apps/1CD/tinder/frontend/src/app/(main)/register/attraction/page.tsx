/* eslint-disable camelcase */
'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateAttractionMutation } from '@/generated';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';

const InterestedIn = () => {
  const [updateAttraction] = useUpdateAttractionMutation({
    onCompleted: () => {
      router.push('/register/birthday');
    },
  });

  const FormSchema = z.object({
    interestedIn: z.string({
      message: 'Please select an email to display.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await updateAttraction({
      variables: {
        attraction: data.interestedIn,
      },
    });
  };

  return (
    <div className="flex flex-col items-center pt-[80px] min-h-screen justify-between">
      <div className=" flex gap-6 flex-col">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center" data-cy="logo-container">
            <Image src="/logo.svg" width={20.28} height={24.02} alt="" />
            <div className="text-[#424242] text-3xl font-semibold">tinder</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-semibold text-2xl">Who are you interested in?</div>
            <div className="text-[#71717A] text-sm">Pick the one that feels right for you!</div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="interestedIn"
                render={({ field }) => (
                  <FormItem data-cy="select-button">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[400px]">
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
                  Next
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <p className="text-[#71717A] text-sm pb-[24px]">©2024 Tinder</p>
    </div>
  );
};

export default InterestedIn;
