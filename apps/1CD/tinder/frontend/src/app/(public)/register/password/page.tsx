'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// import { Toaster } from '@/components/ui/sonner';
// import { toast } from 'sonner';





const Password = () => {
  return (
    <div data-cy='register-page-container' className="pt-[200px] justify-items-center">
      <div data-cy='register-email-header' className="flex items-center gap-1">
        <Image src="../logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
        <div  className="text-[#424242] font-bold text-2xl">tinder</div>
      </div>
      <div className="text-[#09090B] font-semibold text-2xl pt-6 ">Create password</div>
      <div className="text-[#71717A] w-[330px] text-sm font-normal pt-1 text-center">Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers</div>
      <div className="pt-6">
        <div className="text-[#09090B] font-medium text-sm pb-2">Password</div>
        <Input data-cy="register-email-input" placeholder="name@example.com" className="w-[350px] border-[#E4E4E7] border-2" />
        <div className="text-[#09090B] font-medium text-sm pb-2 pt-4">Confirm Password</div>
        <Input data-cy="register-email-input" placeholder="name@example.com" className="w-[350px] border-[#E4E4E7] border-2" />
        <Button data-cy="register-continue-button"className="w-[350px] h-9 bg-[#E11D48E5] rounded-full text-[#FAFAFA] text-sm font-medium mt-4" >
          Continue.
        </Button>
        
        {/* <Toaster /> */}

       
      </div>
    </div>
  );
};
export default Password;
