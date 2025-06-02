/* eslint-disable @next/next/no-img-element */
export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[900px] bg-white w-screen">
      <img src={'tinder.svg'} alt="" width={200} height={200}/>
      <div className="relative w-10 h-10 mt-4 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-pink-300 opacity-30"></div>
        <div className="absolute inset-0 rounded-full border-4  border-red-600 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-white"></div>
      </div>
      <p className="text-black text-sm font-semibold text-center text-gray-500">Please Wait...</p>  
      <div className="bottom-4 text-xs text-gray-500">©2024 Tinder</div>
    </div>
  );
};