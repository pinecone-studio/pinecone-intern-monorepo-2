'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSignInMutation } from '@/generated';

import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const signInSchema=z.object({
    email: z
    .string()
    .min(1, { message: 'Email is required.' }),
    password: z
      .string()
      .min(1, { message: 'Password is required.' })
     
})
type ValidationSchemaType = z.infer<typeof signInSchema>;

const SignIn = () => {
 
  const {register,handleSubmit,formState:{errors}}=useForm<ValidationSchemaType>({resolver:zodResolver(signInSchema)});

  const [signIn, { loading }] = useSignInMutation({
    onCompleted: async(data) => {
      const token=data.signIn.token;
      await fetch(`token?token=${token}`);
      router.push('/recs');
    },
    onError: (error) => {
      toast.error(error.message);
    },
   
  });
  const router = useRouter();
  const onSubmit=async(data:ValidationSchemaType)=>{
    await signIn({
        variables:{
            email:data.email,
            password:data.password,
        }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div data-cy="register-page-container" className="pt-[150px] justify-items-center">
      <div data-cy="register-email-header" className="flex items-center gap-1">
        <Image src="/logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
        <div className="text-[#424242] font-bold text-2xl">tinder</div>
      </div>
      <div className="text-[#09090B] font-semibold text-2xl pt-6 ">Sign in</div>
      <div className="text-[#71717A] text-sm font-normal pt-1">Enter your email below to sign in</div>
      <div className="pt-6">
        <div className="text-[#09090B] font-medium text-sm pb-2">Email</div>
        <Input data-cy="signIn-email-input" placeholder="name@example.com" className="w-[350px] border-[#E4E4E7] border-2" id='email' type='email' {...register('email')} />
        {errors.email?.message && <p className='pt-2 text-sm text-red-600'>{errors.email?.message}</p>}
        <div className="flex justify-between pt-6">
          <div className="text-[#09090B] font-medium text-sm pb-2">Password</div>
          <Link href="/forgetPassword/email">
            <div className="text-[#2563EB] font-medium text-sm">Forget password?</div>
          </Link>
        </div>

        <Input data-cy="signIn-password-input" placeholder="Tinder12345@" className="w-[350px] border-[#E4E4E7] border-2" id="password" type="password" {...register('password')} />
        {errors.password?.message && <p className='pt-2 text-sm text-red-600'>{errors.password.message}</p>}
        <Button className="w-[350px] h-9 bg-[#E11D48E5] rounded-full text-[#FAFAFA] text-sm font-medium mt-4"  type='submit' disabled={loading}>
          {loading ? <Image src="/sw.svg" alt="loading" width={20} height={20} className="animate-spin" /> : 'Continue'}
        </Button>
        <div className="flex">
          <Separator className="my-8 w-[145px]" color="#E4E4E7" />
          <div className="my-6 text-[#71717A] font-normal text-xs mx-5">OR</div>
          <Separator className="my-8 w-[145px]" color="#E4E4E7" />
        </div>
        <Link href={'/register/email'}>
        <Button className="w-[350px] h-9 bg-white border-[#E4E4E7] rounded-full text-[#18181B] hover:bg-white border-2 text-sm font-medium mt-4">Create an account</Button>
        </Link>
       

        <div className="text-[#71717A] font-normal text-sm pt-6 text-center">By clicking continue, you agree to our</div>
        <div className="flex justify-center">
          <div className="text-[#71717A] font-normal text-sm text-center underline-offset-1 underline">Terms of Service </div>
          <div className="text-[#71717A] font-normal text-sm text-center mx-1"> and</div>
          <div className="text-[#71717A] font-normal text-sm text-center underline-offset-1 underline"> Privacy Policy</div>
        </div>
      </div>
    </div>
    </form>
  );
};
export default SignIn;
