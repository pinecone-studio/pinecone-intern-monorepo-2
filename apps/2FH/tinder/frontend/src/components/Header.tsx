'use client';

interface HeaderProps {
  onCreateAccount: () => void;
  onSignIn: () => void;
}

export const Header = ({ onCreateAccount, onSignIn }: HeaderProps) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 md:px-[320px] pt-3">
      <div className="flex items-center space-x-2 w-[101px] h-[24px]">
        <img src="/TinderLogo-20172.png" alt="Tinder Logo" className="w-full h-full object-cover"/>
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
