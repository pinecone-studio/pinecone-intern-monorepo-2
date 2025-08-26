'use client';
import { useRouter } from "next/navigation";
import { Header, Footer, BackgroundGradients } from "@/components";
 
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
        <BackgroundGradients />
      </div>
              
      <Header onCreateAccount={handleCreateAccount} onSignIn={handleSignIn} />
      
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
      
      <Footer />
    </div>
  );
};
 
export default Page;