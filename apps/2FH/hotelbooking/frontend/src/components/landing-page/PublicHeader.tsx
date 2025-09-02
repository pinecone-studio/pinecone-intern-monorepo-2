'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const PublicHeader = () => {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/signup');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <div data-testid="Header-Container">
      <div className="flex justify-between w-full pt-5 pb-5 px-40 items-center bg-[#013B94]">
        <Button className="flex gap-[5px] bg-transparent items-center" onClick={handleLogoClick}>
          <div className="p-3 bg-white rounded-full "></div>
          <div className="text-white">Pedia</div>
        </Button>
        <div className="flex gap-10 items-center">
          <Button className="text-white bg-[#013B94]" onClick={handleRegister}>
            Register
          </Button>
          <Button className="text-white bg-[#013B94]" onClick={handleSignIn}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};
