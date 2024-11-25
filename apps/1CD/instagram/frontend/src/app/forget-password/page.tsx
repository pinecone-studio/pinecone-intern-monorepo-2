'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
const Forgetpassword = () => {
  const [emailInput, setEmailInput] = useState('');
  return (
    <div data-cy="Forget-pass-page" className="bg-gray-100 w-screen h-screen flex items-center">
      <div className="w-[364px] h-[493px] bg-white mx-auto rounded-xl">
        <div className="h-full p-6 space-y-3 flex flex-col justify-evenly">
          <div className="flex flex-col items-center mt-5 space-y-3">
            <section className="relative w-16 h-16 border-2 border-black rounded-full">
              <Image src="/lock.png" alt="forgetpassword" fill className="absolute p-4" />
            </section>
            <h1 className="font-bold">Trouble logging in?</h1>
            <p className="text-center w-[90%] text-gray-600">Enter your email and we will send you a link to get back into your account.</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Input data-cy="Forget-pass-page-enter-email-input" placeholder="Email" type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
            {emailInput.length === 0 && (
              <Button disabled className="bg-blue-200 w-full text-base">
                Send change password link
              </Button>
            )}
            {emailInput.length > 0 && (
              <Button data-cy="Forget-pass-page-send-link-button" className="bg-blue-500 w-full text-base">
                Send change password link
              </Button>
            )}
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
