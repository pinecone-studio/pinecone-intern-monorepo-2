
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreatePasswordMutation } from '@/generated';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(10, { message: 'Password must be longer than 10 charachters.' })
      .max(20, { message: 'Password must be shorter than 20 characters.' })
      .refine((password) => /[A-Z]/.test(password), { message: 'Password must contain at least one uppercase letter.' })
      .refine((password) => /[a-z]/.test(password), { message: 'Password must contain at least one lowercase letter.' })
      .refine((password) => /[0-9]/.test(password), { message: 'Password must contain at least one number.' })
      .refine((password) => /[!@#$%^&*]/.test(password), { message: 'Password must contain at least one special character.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must be identical.',
  });
type ValidationSchemaType = z.infer<typeof passwordSchema>;

const SetPassword = () => {
 
  const router=useRouter();

  
    useEffect(() => {
      router.push('/forgetPassword/password');
    },[router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchemaType>({ resolver: zodResolver(passwordSchema) });




  const [createPassword,{loading}] = useCreatePasswordMutation({
  
    onCompleted:()=>{
      router.push('/recs');
    }
  });



  const onSubmit = async (data: ValidationSchemaType) => {
    await createPassword({
      variables: {
        input: { password: data.password},
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div data-cy="register-page-container" className="pt-[150px] justify-items-center">
        <div data-cy="register-email-header" className="flex items-center gap-1">
          <Image src="/logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
          <div className="text-[#424242] font-bold text-2xl">tinder</div>
        </div>
        <div className="text-[#09090B] font-semibold text-2xl pt-6 ">Set new password</div>
        <div className="text-[#71717A] w-[330px] text-sm font-normal pt-1 text-center">Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers</div>
        <div className="pt-6">
          <div className="text-[#09090B] font-medium text-sm pb-2">Password</div>
          <Input data-cy="register-password-input" placeholder="password1234@" id="password" type="password" {...register('password')} className="w-[350px] border-[#E4E4E7] border-2" />
          {errors.password?.message && <p className="pt-2 text-sm text-red-600">{errors.password?.message}</p>}
          <div className="text-[#09090B] font-medium text-sm pb-2 pt-4">Confirm Password</div>
          <Input data-cy="register-confirm-password-input" placeholder="password1234@" className="w-[350px] border-[#E4E4E7] border-2" id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword?.message && <p className="pt-2 text-sm text-red-600">{errors.confirmPassword?.message}</p>}
          <Button data-cy="register-continue-button" className="w-[350px] h-9 bg-[#E11D48E5] rounded-full text-[#FAFAFA] text-sm font-medium mt-4" type="submit">
            {loading ? <Image src="/sw.svg" alt="loading" width={20} height={20} className="animate-spin" /> : 'Continue'}
          </Button>
        </div>
      </div>
    </form>
  );
};
export default SetPassword;
