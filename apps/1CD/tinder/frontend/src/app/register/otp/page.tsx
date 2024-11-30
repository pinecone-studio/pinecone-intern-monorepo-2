import Image from 'next/image';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"

const Register = () => {
  return (
    <div className="pt-[200px] justify-items-center">
      <div className="flex items-center gap-1">
        <Image src="../logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
        <div className="text-[#424242] font-bold text-2xl">tinder</div>
      </div>
      <div className="text-[#09090B] font-semibold text-2xl">Confirm email</div>
      <div className="text-[#71717A] w-[322px] text-sm font-normal pt-1">To continue, enter the secure code we sent to n.shagai@nest.mn. Check junk mail if it’s not in </div>
      <div className="text-[#71717A]  text-sm font-normal">your inbox.</div>
      <InputOTP maxLength={4} >
      <InputOTPGroup className='mt-6'>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
       
      </InputOTPGroup>
    </InputOTP>
    </div>
  );
};
export default Register;
