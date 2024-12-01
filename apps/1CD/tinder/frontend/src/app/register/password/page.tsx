import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const createPassword = () => {
  return (
    <div className="pt-[200px] justify-items-center">
      <div className="flex items-center gap-1">
        <Image src="../logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
        <div className="text-[#424242] font-bold text-2xl">tinder</div>
      </div>
      <div className="text-[#09090B] font-semibold text-2xl mt-8">Create password</div>
      <div className="text-[#71717A] w-[320px] text-sm font-normal pt-1 text-center">Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers </div>
      <div className='pt-6'>
        <div className='text-[#09090B] font-medium text-sm'>Password</div>
        <Input placeholder="name@example.com" className="w-[350px] h-9 mt-2" />
      </div>
      <div className='pt-4'>
        <div className='text-[#09090B] font-medium text-sm'>Confirm Password</div>
        <Input placeholder="name@example.com" className="w-[350px] h-9 mt-2" />
      </div>
      <Button className='bg-[#E11D48E5] px-[144.5px] py-2 text-[#FAFAFA] text-sm font-medium rounded-full mt-2'>Continue</Button>

      
    </div>
  );
};
export default createPassword;
