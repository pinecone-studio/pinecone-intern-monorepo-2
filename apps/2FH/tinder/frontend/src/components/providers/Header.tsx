'use client';
import Image from 'next/image';

interface HeaderProps {
  onCreateAccount: () => void;
  onSignIn: () => void;
}

export const Header = ({ onCreateAccount, onSignIn }: HeaderProps) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 md:px-[320px] pt-3">
      <div className="flex items-center space-x-2 w-[101px] h-[24px]">
        <Image src="https://res.cloudinary.com/dlk2by5fg/image/upload/v1757329909/TinderLogo-2017_2_2_lhx2v6.png" alt="Tinder Logo" width={101} height={24} className="w-full h-full object-cover" />
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onCreateAccount}
          className="bg-transparent text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors border border-white/20 cursor-pointer"
          type="button"
        >
          Create Account
        </button>
        <button
          onClick={onSignIn}
          className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          type="button"
        >
          Log in
        </button>
      </div>
    </header>
  );
};
