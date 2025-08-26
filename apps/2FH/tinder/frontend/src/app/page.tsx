'use client';
import { useRouter } from "next/navigation";
 
const Page = () => {
  const router = useRouter();
  
  const handleCreateAccount = () => {
    router.push("/signup");
  };
  
  const handleSignIn = () => {
    router.push("/signin");
  };
 
  return (
    <div className="flex h-screen w-screen relative shadow-2xl">
      <div className="w-screen h-screen relative">
        <img
          src="/Frame1321316627.png"
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-black/60 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-black/60 via-transparent to-transparent pointer-events-none"></div>
 
        <div className="absolute top-0 left-0 w-screen h-screen bg-gradient-to-br from-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-screen h-screen bg-gradient-to-bl from-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-screen h-screen bg-gradient-to-tr from-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-screen h-screen bg-gradient-to-tl from-black/40 to-transparent pointer-events-none"></div>
      </div>
              
      {/* Header with fixed z-index */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 md:px-[320px] pt-3">
        <div className="flex items-center space-x-2 w-[101px] h-[24px]">
          <img src="/TinderLogo-20172.png" alt="Tinder Logo" className="w-full h-full object-cover"/>
        </div>
                  
        <div className="flex space-x-3">
          <button
            onClick={handleCreateAccount}
            className="bg-transparent text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors border border-white/20 cursor-pointer"
            type="button"
          >
            Create Account
          </button>
          <button
            onClick={handleSignIn}
            className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
            type="button"
          >
            Log in
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg">
          Swipe Right®
        </h1>
        <button
          onClick={handleCreateAccount}
          className="bg-[#E11D48] text-white px-8 py-3 rounded-full text-xl font-medium hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
          type="button"
        >
          Create Account
        </button>
      </main>
      
      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between p-6 px-8 md:px-[200px]">
        <div className="flex items-center space-x-2">
          <div className="w-[101px] h-[24px] opacity-50">
            <img src="/Group.png" alt="Tinder Logo"  className="w-full h-full object-cover"/>
          </div>
        </div>
                  
        <div className="text-white text-sm opacity-50">
          © Copyright 2024
        </div>
      </footer>
    </div>
  );
};
 
export default Page;