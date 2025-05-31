/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white w-screen text-gray-500">
      <img src={'/tinder.svg'} alt="" width={200} height={200} />
      <div className="relative w-12 h-12 mt-4 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-pink-300 opacity-30"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-pink-500 border-opacity-80 animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-white"></div>
      </div>

      <p className="text-sm font-semibold text-center text-black">Please Wait...</p>
      <div className="abolute bottom-4 text-sm text-gray-450">©2024 Tinder</div>
    </div>
  );
};
