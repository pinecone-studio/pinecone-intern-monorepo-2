'use client';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { useCheckEmailMutation } from '@/generated';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const CheckEmail = () => {
  const [email, setEmail] = useState<string>('');
  const router = useRouter();

  const [checkEmail, { loading }] = useCheckEmailMutation({
    onCompleted: (data) => {
      localStorage.setItem('userEmail', data.checkEmail.email);
      router.push('/forgetPassword/otp');
    },
    onError: (error) => {
      toast.error(error.message);
    },
    variables: {
      input: { email },
    },
  });

  return (
    <div data-cy="forgetpassword-page-container" className="min-h-screen flex flex-col items-center justify-center bg-white pt-[150px]">
      <div data-cy="forgetpassword-email-header" className="flex gap-2">
        <Image src="/logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />

        <div className="text-[#424242] font-bold text-2xl">tinder</div>
      </div>
      <div className="w-full max-w-md">
        <h1 className="text-center text-[#09090B] font-semibold text-2xl pt-2">Forget password</h1>
        <p className="pt-1 mb-6 text-sm text-center text-gray-500">Enter your email account to reset password</p>

        <div className="flex flex-col items-center">
          <div>
            <div className="block pt-2 mb-1 text-sm text-gray-600">Email</div>
            <Input
              data-cy="forgetpassword-email-input"
              type="email"
              placeholder="name@example.com"
              className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg max-sm:w-[350px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="pt-2 flex justify-center">
          <Button
            data-cy="forgetpassword-continue-button"
            type="submit"
            className="w-[400px] bg-[#fd5b6d] hover:bg-[#fd4b5d] text-white py-4 rounded-full font-medium transition duration-200 max-sm:w-[350px]"
            onClick={() => checkEmail()}
            disabled={loading}
          >
           {loading ? <Image src="/sw.svg" alt="loading" width={20} height={20} className="animate-spin" /> : 'Continue'}
          </Button>
        </div>
      </div>
      <div className="py-6 mt-auto text-sm text-gray-400 ">©2024 Tinder</div>
    </div>
  );
};

export default CheckEmail;
